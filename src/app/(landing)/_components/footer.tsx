import { CodeIcon } from "@radix-ui/react-icons";
import { ThemeToggle } from "@/components/theme-toggle";

const githubUrl = "https://github.com/crstnmac/rentracker";
const twitterUrl = "https://twitter.com/crstnmac";

export const Footer = () => {
  return (
    <footer className="px-4 py-6">
      <div className="container flex items-center p-0">
        <CodeIcon className="mr-2 h-6 w-6" />
        <p className="text-sm">
          Built by{" "}
          <a className="underline underline-offset-4" href={twitterUrl}>
            crstnmac
          </a>
          . Get the source code from{" "}
          <a className="underline underline-offset-4" href={githubUrl}>
            GitHub
          </a>
          .
        </p>
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
};
