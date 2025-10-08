import GeneratorPage from "~/app/pages/private/other/generator/generator.page";
import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [{ title: "FTCC | Generator" }];
};

export default function AdminGeneratorRoute() {
  return <GeneratorPage />;
}
