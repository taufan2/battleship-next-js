import {NextMiddleware, NextResponse} from "next/server";
import {uuidv4} from "@firebase/util";

const middleware: NextMiddleware = (
    req,
    event,
) => {
    const res = NextResponse.next();

    if (!req.cookies.get("_id")) {
        const newId = uuidv4();
        res.cookies.set("_id", newId);
        res.headers.set("X-USER-ID", newId)
    }

    return res;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|favicon.ico).*)',
    ],
}


export default middleware;
