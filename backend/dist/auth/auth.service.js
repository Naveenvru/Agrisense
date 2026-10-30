"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const user_entity_1 = require("../users/user.entity");
const bcrypt = __importStar(require("bcrypt"));
const notifications_service_1 = require("../notifications/notifications.service");
let AuthService = class AuthService {
    usersService;
    jwtService;
    notificationsService;
    constructor(usersService, jwtService, notificationsService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.notificationsService = notificationsService;
    }
    async register(registerDto) {
        const existingUser = await this.usersService.findOneByEmail(registerDto.email);
        if (existingUser) {
            throw new common_1.ConflictException('Email already registered');
        }
        const passwordHash = await bcrypt.hash(registerDto.password, 10);
        const user = await this.usersService.create({
            name: registerDto.name,
            email: registerDto.email,
            passwordHash,
            phoneNumber: registerDto.phoneNumber || null,
            role: registerDto.role,
            preferredLanguage: registerDto.preferredLanguage || 'en',
            authProvider: 'local',
            isEmailVerified: false,
            isActive: true,
        });
        await this.notificationsService.getPreferences(user.id);
        const { passwordHash: _, ...result } = user;
        return result;
    }
    async login(loginDto) {
        const user = await this.usersService.findOneByEmail(loginDto.email);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.passwordHash) {
            throw new common_1.UnauthorizedException('This account was created using Google Sign-In. Please click "Continue with Google".');
        }
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('User account is deactivated');
        }
        await this.usersService.updateLastLogin(user.id);
        const payload = { sub: user.id, email: user.email, role: user.role };
        const { passwordHash: _, ...result } = user;
        return {
            accessToken: this.jwtService.sign(payload),
            user: result,
        };
    }
    async validateOAuthUser(email, name, googleId) {
        let user = null;
        if (googleId) {
            user = await this.usersService.findOneByGoogleId(googleId);
        }
        if (!user && email) {
            user = await this.usersService.findOneByEmail(email);
            if (user) {
                user = await this.usersService.update(user.id, {
                    googleId: googleId || user.googleId,
                    isEmailVerified: true,
                });
            }
        }
        if (!user) {
            user = await this.usersService.create({
                name: name || email.split('@')[0],
                email,
                passwordHash: null,
                googleId: googleId || null,
                authProvider: 'google',
                isEmailVerified: true,
                role: user_entity_1.UserRole.FARMER,
                isActive: true,
            });
            await this.notificationsService.getPreferences(user.id);
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('User account is deactivated');
        }
        await this.usersService.updateLastLogin(user.id);
        return user;
    }
    generateToken(user) {
        const payload = { sub: user.id, email: user.email, role: user.role };
        return {
            accessToken: this.jwtService.sign(payload),
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        notifications_service_1.NotificationsService])
], AuthService);
//# sourceMappingURL=auth.service.js.map