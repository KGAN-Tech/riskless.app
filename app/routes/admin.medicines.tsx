import MedicinesPage from "~/app/pages/private/other/medicines/medicines.page";
import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [{ title: "FTCC | Medicines" }];
};

export default function AdminMedicines() {
  return <MedicinesPage />;
}
