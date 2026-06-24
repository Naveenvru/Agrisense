declare const _default: (() => {
    jwtSecret: string;
    jwtExpiresIn: string;
    googleClientId: string;
    googleClientSecret: string;
    googleCallbackUrl: string;
    port: number;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    jwtSecret: string;
    jwtExpiresIn: string;
    googleClientId: string;
    googleClientSecret: string;
    googleCallbackUrl: string;
    port: number;
}>;
export default _default;
