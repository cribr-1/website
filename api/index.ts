export default async function handler(req: any, res: any) {
  try {
    // Dynamically import the app to catch initialization errors on Vercel
    const appModule = await import("../src/server/app");
    const app = (appModule.default || appModule) as any;
    return app(req, res);
  } catch (err: any) {
    console.error("Vercel App Initialization Error:", err);
    res.status(500).json({
      error: "Vercel API Initialization Failed",
      message: err.message,
      stack: err.stack,
    });
  }
}
