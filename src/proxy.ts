import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "mr_gestor_session";

const publicPaths = ["/login", "/mfa/setup", "/mfa/verify"];

// Checagem otimista: sem cookie de sessão não há o que validar nas páginas
// protegidas, então redireciona antes de renderizar. A autorização real
// (assinatura da sessão, RBAC e isolamento por empresa) continua no servidor,
// em cada página e rota.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSessionCookie = request.cookies.has(SESSION_COOKIE);

  if (publicPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
    return NextResponse.next();
  }

  if (!hasSessionCookie) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|icon.svg|robots.txt|brand|media).*)",
  ],
};
