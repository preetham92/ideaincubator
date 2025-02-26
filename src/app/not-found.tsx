import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
      <h2 className="text-4xl font-bold text-destructive">Not Found</h2>
      <p className="text-xl text-muted-foreground">Could not find requested resource</p>
      <Link 
        href="/"
        className="text-primary hover:underline"
      >
        Return Home
      </Link>
    </div>
  );
}