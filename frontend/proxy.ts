import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// 1. تحديد المسارات العامة
const isPublicRoute = createRouteMatcher(['/login(.*)', '/signup(.*)']);

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth();

  // 2. إذا لم يكن هناك مستخدم وهو يحاول دخول مسار خاص
  if (!userId && !isPublicRoute(request)) {
    // يمكنك استخدام redirectToSignIn لإرجاع المستخدم لصفحة اللوجن
    return (await auth()).redirectToSignIn();
  }

  // 3. إذا كان المستخدم مسجل دخول ويحاول دخول صفحات اللوجن (التحويل العكسي)
  if (userId && isPublicRoute(request)) {
    const home = new URL('/', request.url);
    return NextResponse.redirect(home);
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};