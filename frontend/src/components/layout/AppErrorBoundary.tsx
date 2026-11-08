import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { hasError: boolean };

export default class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Application render error:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-[#FAFAF8] px-6 text-center text-[#232323]">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#C5A572]">
            Something went wrong
          </p>
          <h1 className="mt-4 font-serif text-3xl sm:text-4xl">
            We couldn’t load this page.
          </h1>
          <p className="mt-3 max-w-lg text-sm leading-7 text-[#4A4A4A]">
            Please try again. If the problem continues, return to the home page.
          </p>
          <div className="mt-7 flex gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-full bg-[#232323] px-6 py-3 text-sm font-medium text-white"
            >
              Try again
            </button>
            <a
              href="/"
              className="rounded-full border border-[#232323]/20 px-6 py-3 text-sm font-medium"
            >
              Home
            </a>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
