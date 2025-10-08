import GeneratorXMLPage from "~/app/pages/private/other/generator/generator.xml.page";
import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [{ title: "FTCC | Generator XML" }];
};

export default function AdminGeneratorXMLRoute() {
  return <GeneratorXMLPage />;
}
