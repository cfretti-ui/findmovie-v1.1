import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">
          FindMovie
        </p>

        <h1 className="mt-5 text-7xl font-semibold tracking-[-0.06em] sm:text-8xl">
          404
        </h1>

        <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-muted sm:text-base">
          Cette page n’existe pas ou n’est plus disponible.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex h-11 items-center rounded-full bg-foreground px-6 text-sm font-medium text-background transition-transform duration-200 hover:scale-[1.02]"
        >
          Retour à l’accueil
        </Link>
      </div>
    </main>
  );
}