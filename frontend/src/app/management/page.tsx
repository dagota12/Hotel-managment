import { Card, CardContent } from "@/components/ui/card";
import { ManagementClient } from "./management-client";

export default function ManagementPage() {
  return (
    <section className="space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="pt-2">
          <p className="text-xs uppercase tracking-[0.28em] text-primary">
            Management
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-foreground">
            Departments, roles, and shifts
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Use tabs to keep master data simple.
          </p>
        </CardContent>
      </Card>

      <ManagementClient />
    </section>
  );
}

