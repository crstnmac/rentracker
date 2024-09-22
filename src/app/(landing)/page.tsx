import { type Metadata } from "next";

import { NextjsLight, NextjsDark } from "./_components/feature-icons";
import CardSpotlight from "./_components/hover-card";

export const metadata: Metadata = {
  title: "Rentracker",
  description: "Rentracker is a simple and easy to use tool to track your rental properties.",
};

const githubUrl = "https://github.com/crstnmac/rentracker";

const features = [
  {
    name: "Track Rent",
    description: "Keep track of rent payments and due dates.",
  },
  {
    name: "Track Expenses",
    description: "Keep track of expenses and receipts.",
  },
  {
    name: "Track Tenants",
    description: "Keep track of tenant information.",
  },
  {
    name: "Track Properties",
    description: "Keep track of property information.",
  },
  {
    name: "Track Documents",
    description: "Keep track of important documents.",
  },
  {
    name: "Track Maintenance",
    description: "Keep track of maintenance requests.",
  },
  {
    name: "Track Tasks",
    description: "Keep track of tasks and reminders.",
  },
  {
    name: "Track Income",
    description: "Keep track of income and expenses.",
  },
  {
    name: "Track Leases",
    description: "Keep track of lease agreements.",
  },
  {
    name: "Track Vendors",
    description: "Keep track of vendor information.",
  },
  {
    name: "Track Reports",
    description: "Keep track of reports and analytics.",
  },
  {
    name: "Track Contacts",
    description: "Keep track of contact information"
  }
];

const HomePage = () => {
  return (
    <>
      <section className="mx-auto grid min-h-[calc(100vh-300px)] max-w-5xl flex-col items-center justify-center gap-4 py-10 text-center md:py-12">
        <h1 className="text-4xl font-bold">Rentracker</h1>
      </section>
      <section className="mx-auto grid min-h-[calc(100vh-300px)] max-w-5xl flex-col items-center justify-center gap-4 py-10 text-center md:py-12">
        <h1 className="text-4xl font-bold">Features</h1>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <CardSpotlight key={feature.name} {...feature} logo />
          ))}
        </div>
      </section>
    </>
  );
};

export default HomePage;

function NextjsIcon({ className }: { className?: string }) {
  return (
    <>
      <NextjsLight className={className + " dark:hidden"} />
      <NextjsDark className={className + " hidden dark:block"} />
    </>
  );
}
