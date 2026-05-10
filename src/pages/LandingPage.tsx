import { Link } from "react-router-dom";
import { Bot, BriefcaseBusiness, Search, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { APP_CONFIG, UI_STRINGS } from "@/lib/constants";

export function LandingPage() {
  const features = [
    { icon: ShieldCheck, title: UI_STRINGS.FEATURE_1_TITLE, body: UI_STRINGS.FEATURE_1_BODY },
    { icon: Search, title: UI_STRINGS.FEATURE_2_TITLE, body: UI_STRINGS.FEATURE_2_BODY },
    { icon: Bot, title: UI_STRINGS.FEATURE_3_TITLE, body: UI_STRINGS.FEATURE_3_BODY },
  ];

  return (
    <PageWrapper className="py-10">
      <section className="grid items-center gap-10 py-8 md:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div className="mb-4 inline-flex rounded-md bg-teal-50 px-3 py-1 text-sm font-medium text-teal-700">{APP_CONFIG.NAME}</div>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-normal text-slate-950 md:text-6xl">{UI_STRINGS.LANDING_TAGLINE}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            {UI_STRINGS.LANDING_SUBHEADING}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" variant="accent"><Link to="/auth">{UI_STRINGS.LANDING_JOIN_RECRUITER}</Link></Button>
            <Button asChild size="lg" variant="outline"><Link to="/auth">{UI_STRINGS.LANDING_FIND_RECRUITERS}</Link></Button>
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white"><BriefcaseBusiness className="h-8 w-8" /></div>
            <div>
              <p className="text-xl font-semibold">{UI_STRINGS.DEMO_NAME}</p>
              <p className="text-slate-600">{UI_STRINGS.DEMO_HEADLINE}</p>
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[UI_STRINGS.DEMO_VIEWS, `412 ${UI_STRINGS.FOLLOWERS}`, UI_STRINGS.DEMO_ROLES].map((stat) => (
              <div key={stat} className="rounded-md bg-slate-50 p-4 text-center font-medium text-sm text-slate-700">
                {stat}
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-md bg-teal-50 p-4 text-sm leading-6 text-teal-900">{UI_STRINGS.LANDING_AI_PROMPT_PREVIEW}</div>
        </div>
      </section>
      <section className="grid gap-4 py-8 md:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card key={feature.title}>
              <CardContent className="p-5">
                <Icon className="h-6 w-6 text-teal-700" />
                <h2 className="mt-4 font-semibold text-slate-950">{feature.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{feature.body}</p>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </PageWrapper>
  );
}
