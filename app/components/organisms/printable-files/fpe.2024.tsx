import SelectionMarker from "./components/selection.marker";
import InputField from "./components/input.field";
import TextFormat from "./components/text.format";
import { useRef } from "react";

import { Printer } from "lucide-react";
import { Button } from "@/components/atoms/button";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/atoms/table";

import * as ReactToPrint from "react-to-print";

const FPE2024 = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = ReactToPrint.useReactToPrint({ contentRef });

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={reactToPrintFn} className="flex items-center gap-2">
          <Printer className="h-4 w-4" />
          Print Form
        </Button>
      </div>
      <div className="mt-6 overflow-auto max-h-[80vh] max-w-full">
        <div
          ref={contentRef}
          className="mx-auto bg-white p-4 print:p-0 print:shadow-none print:bg-white print:mx-0 print:ml-10 print:max-w-[730px] max-w-[750px] print:m-auto"
          style={{ boxSizing: "border-box" }}
        >
          <Table>
            <TableBody>
              {/* FORM TITLE */}
              <TableRow className="border-0 ">
                <TableCell
                  className="border-none p-0 text-right align-top "
                  colSpan={24}
                >
                  <div className="flex flex-col items-end">
                    <div className="font-[Times New Roman] font-bold text-[18px]">
                      Annex G: Template for Health Screening/First Patient
                      Encounter (FPE)
                    </div>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow className="border-0 ">
                <TableCell
                  className="border-none p-0 text-center align-top"
                  colSpan={24}
                >
                  <div className="flex flex-col">
                    <div className="font-[Times New Roman] text-[14px]">
                      HEALTH SCREENING/FPE FORM
                    </div>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={24}>
                  {/* CLIENT PROFILE */}
                  <Table
                    className="w-full border-collapse px-5 py-2"
                    style={{
                      tableLayout: "fixed",
                      borderCollapse: "collapse",
                      boxSizing: "border-box",
                      border: "2px solid #000000",
                      maxWidth: "880px",
                    }}
                  >
                    <TableBody className="px-5">
                      <TableRow>
                        <TableCell
                          colSpan={24}
                          className="text-center  font-bold border-b-[2px] border-black"
                        >
                          1. CLIENT PROFILE
                        </TableCell>
                      </TableRow>

                      {/* CLIENT TYPE */}
                      <TableRow className="border-0">
                        <TableCell colSpan={8} className="py-1">
                          <SelectionMarker
                            isChecked={false}
                            variant="circle"
                            size="sm"
                            textScale={false}
                            textClassName="font-normal text-[12px]"
                          >
                            Walk-in clients
                          </SelectionMarker>
                        </TableCell>
                        <TableCell colSpan={4}>
                          <SelectionMarker
                            isChecked={false}
                            variant="circle"
                            size="sm"
                            textScale={false}
                            textClassName="font-normal text-[12px]"
                          >
                            With appointment
                          </SelectionMarker>
                        </TableCell>
                        <TableCell colSpan={12}>
                          <br />
                        </TableCell>
                      </TableRow>

                      {/* SCREENING DATE */}
                      <TableRow className="border-0">
                        <TableCell colSpan={12} className="text-[14px]">
                          *Health Screening Date (mm/dd/yyyy):
                        </TableCell>
                        <TableCell colSpan={12}></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={12}>
                          <InputField
                            variant="solid-border"
                            inputClassName="w-full"
                          />
                        </TableCell>
                        <TableCell colSpan={12}></TableCell>
                      </TableRow>

                      {/* INDIVIDUAL HEALTH PROFILE */}
                      <TableRow className="border-0">
                        <TableCell colSpan={24} className="font-bold py-2">
                          INDIVIDUAL HEALTH PROFILE
                        </TableCell>
                      </TableRow>

                      {/* CASE NUMBER - PHILHEALTH ID NUMBER */}
                      <TableRow className="border-0">
                        <TableCell colSpan={12}>Case Number:</TableCell>
                        <TableCell colSpan={12}>
                          PhilHealth Identification Number:
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={12}>
                          <InputField
                            variant="solid-border"
                            inputClassName="w-full"
                          />
                        </TableCell>
                        <TableCell colSpan={12}>
                          <InputField
                            variant="solid-border"
                            inputClassName="w-full"
                          />
                        </TableCell>
                      </TableRow>

                      {/* INDIVIDUAL HEALTH PROFILE */}
                      <TableRow className="border-0">
                        <TableCell
                          colSpan={24}
                          className="py-2 underline decoration-solid"
                        >
                          Client Details
                        </TableCell>
                      </TableRow>

                      {/* NAME */}
                      <TableRow className="border-0 text-[13px]">
                        <TableCell colSpan={6}>Last Name:</TableCell>
                        <TableCell colSpan={6}>First Name:</TableCell>
                        <TableCell colSpan={6}>Middle Name:</TableCell>
                        <TableCell colSpan={6}>Extension Name:</TableCell>
                      </TableRow>
                      <TableRow className="border-0 text-[12px]">
                        <TableCell colSpan={6}>
                          <InputField
                            variant="solid-border"
                            inputClassName="w-full"
                          />
                        </TableCell>
                        <TableCell colSpan={6}>
                          <InputField
                            variant="solid-border"
                            inputClassName="w-full"
                          />
                        </TableCell>
                        <TableCell colSpan={6}>
                          <InputField
                            variant="solid-border"
                            inputClassName="w-full"
                          />
                        </TableCell>
                        <TableCell colSpan={6}>
                          <InputField
                            variant="solid-border"
                            inputClassName="w-full"
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={24} className="h-2"></TableCell>
                      </TableRow>

                      {/* AGE */}
                      <TableRow className="border-0 text-[12px]">
                        <TableCell colSpan={6}>Age</TableCell>
                        <TableCell colSpan={6}>
                          Date of Birth (mm/dd/yyyy):
                        </TableCell>
                        <TableCell colSpan={6}>Sex:</TableCell>
                        <TableCell colSpan={6}>Client Type:</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={6}>
                          <InputField
                            variant="solid-border"
                            inputClassName="w-full"
                          />
                        </TableCell>
                        <TableCell colSpan={6}>
                          <InputField
                            variant="solid-border"
                            inputClassName="w-full"
                          />
                        </TableCell>
                        <TableCell colSpan={6}>
                          <InputField
                            variant="solid-border"
                            inputClassName="w-full"
                          />
                        </TableCell>
                        <TableCell colSpan={6}>
                          <InputField
                            variant="solid-border"
                            inputClassName="w-full"
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={24} className="h-2"></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={24}>
                  {/* REVIEW */}
                  <Table
                    className="w-full  border-collapse"
                    style={{
                      tableLayout: "fixed",
                      borderCollapse: "collapse",
                      boxSizing: "border-box",
                      border: "2px solid #000000",
                      maxWidth: "880px",
                    }}
                  >
                    <TableBody>
                      <TableRow>
                        <TableCell
                          colSpan={24}
                          className="text-center font-bold border-b-[2px] border-black"
                        >
                          2. REVIEW OF SYSTEMS
                        </TableCell>
                      </TableRow>

                      {/* CHIEF COMPLAINT */}
                      <TableRow className="border-0">
                        <TableCell colSpan={1}>1.</TableCell>
                        <TableCell colSpan={23}>
                          <TextFormat variant="times" size="md">
                            Chief complaint (please describe)
                          </TextFormat>
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={1}></TableCell>
                        <TableCell colSpan={23}>
                          <InputField
                            variant="underline-solid"
                            inputClassName="w-full"
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={1}></TableCell>
                        <TableCell colSpan={23}>
                          <InputField
                            variant="underline-solid"
                            inputClassName="w-full"
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={24} className="h-4"></TableCell>
                      </TableRow>

                      {/* APPETTIE - SLEEP - WEIGHT LOSS */}
                      <TableRow className="border-0">
                        <TableCell colSpan={1}>
                          <TextFormat variant="times" size="md">
                            2.
                          </TextFormat>
                        </TableCell>
                        <TableCell colSpan={23}>
                          <TextFormat variant="times" size="md">
                            Do you experience any of the following: loss of
                            appetite, lack of sleep, unexplained weight loss,
                          </TextFormat>
                          <TextFormat variant="times" size="md">
                            feeling down/depressed, fever, headache, memory
                            loss, blurring of vision, or hearing loss?
                          </TextFormat>
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={1}></TableCell>
                        <TableCell colSpan={4}>
                          <SelectionMarker
                            isChecked={false}
                            variant="circle"
                            size="sm"
                            textScale={false}
                            textClassName="font-normal text-[12px] py-1"
                          >
                            Yes
                          </SelectionMarker>
                        </TableCell>
                        <TableCell colSpan={4}>
                          <SelectionMarker
                            isChecked={false}
                            variant="circle"
                            size="sm"
                            textScale={false}
                            textClassName="font-normal text-[12px] py-1"
                          >
                            No
                          </SelectionMarker>
                        </TableCell>
                        <TableCell colSpan={15}></TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={1}></TableCell>
                        <TableCell colSpan={23}>
                          <TextFormat variant="times" size="md">
                            If yes, please explain:
                          </TextFormat>
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={1}></TableCell>
                        <TableCell colSpan={23}>
                          <InputField
                            variant="underline-solid"
                            inputClassName="w-full"
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={24} className="h-4"></TableCell>
                      </TableRow>

                      {/* COUGH - COLDS - CHEST PAIN */}
                      <TableRow className="border-0">
                        <TableCell colSpan={1}>3.</TableCell>
                        <TableCell colSpan={23}>
                          <TextFormat variant="times" size="md">
                            Do you experience any of the following: cough/colds,
                            chest pain, palpitations, or difficulty in
                          </TextFormat>
                          <TextFormat variant="times" size="md">
                            breathing?
                          </TextFormat>
                          <br />
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={1}></TableCell>
                        <TableCell colSpan={4}>
                          <SelectionMarker
                            isChecked={false}
                            variant="circle"
                            size="sm"
                            textScale={false}
                            textClassName="font-normal text-[12px] py-1"
                          >
                            Yes
                          </SelectionMarker>
                        </TableCell>
                        <TableCell colSpan={4}>
                          <SelectionMarker
                            isChecked={false}
                            variant="circle"
                            size="sm"
                            textScale={false}
                            textClassName="font-normal text-[12px] py-1"
                          >
                            No
                          </SelectionMarker>
                        </TableCell>
                        <TableCell colSpan={15}></TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={1}></TableCell>
                        <TableCell colSpan={23}>
                          If yes, please explain:
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={1}></TableCell>
                        <TableCell colSpan={23}>
                          <InputField
                            variant="underline-solid"
                            inputClassName="w-full"
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={24} className="h-4"></TableCell>
                      </TableRow>

                      {/* ABDOMINAL PAIN - VOMITING - BOWEL */}
                      <TableRow className="border-0">
                        <TableCell colSpan={1}>4.</TableCell>
                        <TableCell colSpan={23}>
                          Do you experience any of the following: abdominal
                          pain, vomiting, change in bowel movement,
                          <br />
                          rectal bleeding, or bloody/tarry stools?
                          <br />
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={1}></TableCell>
                        <TableCell colSpan={4}>
                          <SelectionMarker
                            isChecked={false}
                            variant="circle"
                            size="sm"
                            textScale={false}
                            textClassName="font-normal text-[12px] py-1"
                          >
                            Yes
                          </SelectionMarker>
                        </TableCell>
                        <TableCell colSpan={4}>
                          <SelectionMarker
                            isChecked={false}
                            variant="circle"
                            size="sm"
                            textScale={false}
                            textClassName="font-normal text-[12px] py-1"
                          >
                            No
                          </SelectionMarker>
                        </TableCell>
                        <TableCell colSpan={15}></TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={1}></TableCell>
                        <TableCell colSpan={23}>
                          If yes, please explain:
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={1}></TableCell>
                        <TableCell colSpan={23}>
                          <InputField
                            variant="underline-solid"
                            inputClassName="w-full"
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={24} className="h-4"></TableCell>
                      </TableRow>

                      {/* FREQUENT - URINATION - EATING - FLUIDS */}
                      <TableRow className="border-0">
                        <TableCell colSpan={1}>5.</TableCell>
                        <TableCell colSpan={23}>
                          Do you experience any of the following: frequent
                          urination, frequent eating, frequent intake of
                          <br />
                          fluids?
                          <br />
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={1}></TableCell>
                        <TableCell colSpan={4}>
                          <SelectionMarker
                            isChecked={false}
                            variant="circle"
                            size="sm"
                            textScale={false}
                            textClassName="font-normal text-[12px] py-1"
                          >
                            Yes
                          </SelectionMarker>
                        </TableCell>
                        <TableCell colSpan={4}>
                          <SelectionMarker
                            isChecked={false}
                            variant="circle"
                            size="sm"
                            textScale={false}
                            textClassName="font-normal text-[12px] py-1"
                          >
                            No
                          </SelectionMarker>
                        </TableCell>
                        <TableCell colSpan={15}></TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={1}></TableCell>
                        <TableCell colSpan={23}>
                          If yes, please explain:
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={1}></TableCell>
                        <TableCell colSpan={23}>
                          <InputField
                            variant="underline-solid"
                            inputClassName="w-full"
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={24} className="h-4"></TableCell>
                      </TableRow>

                      {/* URINATION */}
                      <TableRow className="border-0">
                        <TableCell colSpan={1}>6.</TableCell>
                        <TableCell colSpan={23}>
                          For male and female, do you experience ay of the
                          following: pain or discomfort on urination,
                          <br />
                          frequency of urination, dribbling of urine, pain
                          during/after sex, blood in the urine, or foul-
                          <br />
                          smelling genital discharge?
                          <br />
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={1}></TableCell>
                        <TableCell colSpan={4}>
                          <SelectionMarker
                            isChecked={false}
                            variant="circle"
                            size="sm"
                            textScale={false}
                            textClassName="font-normal text-[12px] py-1"
                          >
                            Yes
                          </SelectionMarker>
                        </TableCell>
                        <TableCell colSpan={4}>
                          <SelectionMarker
                            isChecked={false}
                            variant="circle"
                            size="sm"
                            textScale={false}
                            textClassName="font-normal text-[12px] py-1"
                          >
                            No
                          </SelectionMarker>
                        </TableCell>
                        <TableCell colSpan={15}></TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={1}></TableCell>
                        <TableCell colSpan={23}>
                          If yes, please explain:
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={1}></TableCell>
                        <TableCell colSpan={23}>
                          <InputField
                            variant="underline-solid"
                            inputClassName="w-full"
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={24} className="h-1"></TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={24}>
                          This form may be reproduced and is not for sale.
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={24} className="text-right">
                          Page 1 of 2 of Annex G
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={24}>
                  {/* REVIEW CONTINUTATION */}
                  <Table
                    className="w-full  border-collapse"
                    style={{
                      tableLayout: "fixed",
                      borderCollapse: "collapse",
                      boxSizing: "border-box",
                      border: "2px solid #000000",
                      maxWidth: "880px",
                    }}
                  >
                    <TableBody>
                      {/* FOR FEMALES ONLY */}
                      <TableRow className="border-0">
                        <TableCell colSpan={1}>7.</TableCell>
                        <TableCell colSpan={23}>
                          For females only,
                          <br />
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={1}></TableCell>
                        <TableCell colSpan={11}>
                          a. Last menstrual period (mm/dd/yyyy):
                        </TableCell>
                        <TableCell colSpan={12}>
                          b. First menstrual period (mm/dd/yyyy):
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={1}></TableCell>
                        <TableCell colSpan={11}>
                          <InputField
                            variant="underline-solid"
                            inputClassName="w-full"
                          />
                        </TableCell>
                        <TableCell colSpan={12}>
                          <InputField
                            variant="underline-solid"
                            inputClassName="w-full"
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={1}></TableCell>
                        <TableCell colSpan={5}>Number of pregnancy:</TableCell>
                        <TableCell colSpan={6}>
                          <InputField
                            variant="underline-solid"
                            inputClassName="w-full"
                          />
                        </TableCell>
                        <TableCell colSpan={12}></TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={24} className="h-4"></TableCell>
                      </TableRow>

                      {/* MUSClE SPASM - TREMOR - WEAKNESS */}
                      <TableRow className="border-0">
                        <TableCell colSpan={1}>8.</TableCell>
                        <TableCell colSpan={23}>
                          Do you experience any of the following; muscle spasm,
                          tremors, weakness; muscle/joint pain,
                          <br />
                          stiffness, limitation of movement?
                          <br />
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={1}></TableCell>
                        <TableCell colSpan={4}>
                          <SelectionMarker
                            isChecked={false}
                            variant="circle"
                            size="sm"
                            textScale={false}
                            textClassName="font-normal text-[12px] py-1"
                          >
                            Yes
                          </SelectionMarker>
                        </TableCell>
                        <TableCell colSpan={4}>
                          <SelectionMarker
                            isChecked={false}
                            variant="circle"
                            size="sm"
                            textScale={false}
                            textClassName="font-normal text-[12px] py-1"
                          >
                            No
                          </SelectionMarker>
                        </TableCell>
                        <TableCell colSpan={15}></TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={1}></TableCell>
                        <TableCell colSpan={23}>
                          If yes, please explain:
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={1}></TableCell>
                        <TableCell colSpan={23}>
                          <InputField
                            variant="underline-solid"
                            inputClassName="w-full"
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={24} className="h-4"></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={24}>
                          If the answer is yes to Questions 1-8, the beneficiary
                          needs to consult a doctor.
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          colSpan={24}
                          className="text-center font-bold border-2 h-6 border-black"
                        ></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={24}>
                  {/* PERSONAL/SOCIAL HISTORY */}
                  <Table
                    className="w-full mb-2 border-collapse"
                    style={{
                      tableLayout: "fixed",
                      borderCollapse: "collapse",
                      boxSizing: "border-box",
                      border: "2px solid #000000",
                      maxWidth: "880px",
                    }}
                  >
                    <TableBody>
                      <TableRow>
                        <TableCell
                          colSpan={24}
                          className="text-center font-bold border-b-[2px] border-black"
                        >
                          3. PERSONAL/SOCIAL HISTORY
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={1}>1.</TableCell>
                        <TableCell colSpan={23}>
                          Do you smoke cigar, cigarette, e-cigarette, vape, or
                          other similar products?
                          <br />
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={1}></TableCell>
                        <TableCell colSpan={4}>
                          <SelectionMarker
                            isChecked={false}
                            variant="circle"
                            size="sm"
                            textScale={false}
                            textClassName="font-normal text-[12px] py-1"
                          >
                            Yes
                          </SelectionMarker>
                        </TableCell>
                        <TableCell colSpan={2}>
                          <SelectionMarker
                            isChecked={false}
                            variant="circle"
                            size="sm"
                            textScale={false}
                            textClassName="font-normal text-[12px] py-1"
                          >
                            No
                          </SelectionMarker>
                        </TableCell>
                        <TableCell colSpan={4}>Number of years:</TableCell>
                        <TableCell colSpan={2}>
                          <InputField
                            variant="underline-solid"
                            inputClassName="w-full"
                          />
                        </TableCell>
                        <TableCell colSpan={11}></TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={1}></TableCell>
                        <TableCell colSpan={23}>
                          Do you drink alcohol or alcohol-containing beverages?
                          <br />
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={1}></TableCell>
                        <TableCell colSpan={4}>
                          <SelectionMarker
                            isChecked={false}
                            variant="circle"
                            size="sm"
                            textScale={false}
                            textClassName="font-normal text-[12px] py-1"
                          >
                            Yes
                          </SelectionMarker>
                        </TableCell>
                        <TableCell colSpan={2}>
                          <SelectionMarker
                            isChecked={false}
                            variant="circle"
                            size="sm"
                            textScale={false}
                            textClassName="font-normal text-[12px] py-1"
                          >
                            No
                          </SelectionMarker>
                        </TableCell>
                        <TableCell colSpan={4}>Number of years:</TableCell>
                        <TableCell colSpan={2}>
                          <InputField
                            variant="underline-solid"
                            inputClassName="w-full"
                          />
                        </TableCell>
                        <TableCell colSpan={11}></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={24}>
                  {/* PAST MEDICAL HISTORY */}
                  <Table
                    className="w-full mb-2 border-collapse"
                    style={{
                      tableLayout: "fixed",
                      borderCollapse: "collapse",
                      boxSizing: "border-box",
                      border: "2px solid #000000",
                      maxWidth: "880px",
                    }}
                  >
                    <TableBody>
                      <TableRow>
                        <TableCell
                          colSpan={24}
                          className="text-center font-bold border-b-[2px] border-black"
                        >
                          4. PAST MEDICAL HISTORY
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={8}>
                          <SelectionMarker
                            isChecked={false}
                            variant="circle"
                            size="sm"
                            textScale={false}
                            textClassName="font-normal text-[12px] py-1"
                          >
                            Cancer
                          </SelectionMarker>
                          <br />
                          <SelectionMarker
                            isChecked={false}
                            variant="circle"
                            size="sm"
                            textScale={false}
                            textClassName="font-normal text-[12px] py-1"
                          >
                            Allergies
                          </SelectionMarker>
                          <br />
                          <SelectionMarker
                            isChecked={false}
                            variant="circle"
                            size="sm"
                            textScale={false}
                            textClassName="font-normal text-[12px] py-1"
                          >
                            Diabetes Mellitus
                          </SelectionMarker>
                          <br />
                          <SelectionMarker
                            isChecked={false}
                            variant="circle"
                            size="sm"
                            textScale={false}
                            textClassName="font-normal text-[12px] py-1"
                          >
                            Hypertension
                          </SelectionMarker>
                        </TableCell>
                        <TableCell colSpan={8}>
                          <SelectionMarker
                            isChecked={false}
                            variant="circle"
                            size="sm"
                            textScale={false}
                            textClassName="font-normal text-[12px] py-1"
                          >
                            Heart Disease
                          </SelectionMarker>
                          <br />
                          <SelectionMarker
                            isChecked={false}
                            variant="circle"
                            size="sm"
                            textScale={false}
                            textClassName="font-normal text-[12px] py-1"
                          >
                            Stroke
                          </SelectionMarker>
                          <br />
                          <SelectionMarker
                            isChecked={false}
                            variant="circle"
                            size="sm"
                            textScale={false}
                            textClassName="font-normal text-[12px] py-1"
                          >
                            Bronchial asthma
                          </SelectionMarker>
                          <br />
                          <SelectionMarker
                            isChecked={false}
                            variant="circle"
                            size="sm"
                            textScale={false}
                            textClassName="font-normal text-[12px] py-1"
                          >
                            COPD/emphysema/bronchitis
                          </SelectionMarker>
                        </TableCell>
                        <TableCell colSpan={8}>
                          <SelectionMarker
                            isChecked={false}
                            variant="circle"
                            size="sm"
                            textScale={false}
                            textClassName="font-normal text-[12px] py-1"
                          >
                            Tuberculosis
                          </SelectionMarker>
                          <br />
                          <SelectionMarker
                            isChecked={false}
                            variant="circle"
                            size="sm"
                            textScale={false}
                            textClassName="font-normal text-[12px] py-1"
                          >
                            Others
                          </SelectionMarker>
                          <br />
                          please specify:
                          <InputField
                            variant="underline-solid"
                            inputClassName="w-full"
                          />
                          <SelectionMarker
                            isChecked={false}
                            variant="circle"
                            size="sm"
                            textScale={false}
                            textClassName="font-normal text-[12px] py-1"
                          >
                            None
                          </SelectionMarker>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={24}>
                  {/* 5. PERTINENT PHYSICAL EXAMINATION FINDINGS */}
                  <Table
                    className="w-full mb-2 border-collapse"
                    style={{
                      tableLayout: "fixed",
                      borderCollapse: "collapse",
                      boxSizing: "border-box",
                      border: "2px solid #000000",
                      maxWidth: "880px",
                    }}
                  >
                    <TableBody>
                      <TableRow>
                        <TableCell
                          colSpan={24}
                          className="text-center font-bold border-b-[2px] border-black"
                        >
                          5. PERTINENT PHYSICAL EXAMINATION FINDINGS
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell
                          colSpan={24}
                          className="text-left font-bold border-b-[2px] border-black"
                        >
                          PERTINENT PHYSICAL EXAMINATION FINDINGS
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={4}>Blood Pressure</TableCell>
                        <TableCell colSpan={3}>
                          <InputField
                            variant="solid-border"
                            inputClassName="w-full"
                          />
                        </TableCell>
                        <TableCell colSpan={3}>
                          <InputField
                            variant="solid-border"
                            inputClassName="w-full"
                          />
                        </TableCell>
                        <TableCell colSpan={2} className="p-0">
                          mmHg
                        </TableCell>

                        <TableCell colSpan={3}>Height</TableCell>
                        <TableCell colSpan={3}>
                          <InputField
                            variant="solid-border"
                            inputClassName="w-full"
                          />
                        </TableCell>
                        <TableCell colSpan={1} className="p-0">
                          (cm)
                        </TableCell>
                        <TableCell colSpan={3}>
                          <InputField
                            variant="solid-border"
                            inputClassName="w-full"
                          />
                        </TableCell>
                        <TableCell colSpan={1} className="p-0">
                          (in)
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={4}>Heart Rate</TableCell>
                        <TableCell colSpan={6}>
                          <InputField
                            variant="solid-border"
                            inputClassName="w-full"
                          />
                        </TableCell>
                        <TableCell colSpan={2} className="p-0">
                          /min
                        </TableCell>

                        <TableCell colSpan={3}>Weight</TableCell>
                        <TableCell colSpan={3}>
                          <InputField
                            variant="solid-border"
                            inputClassName="w-full"
                          />
                        </TableCell>
                        <TableCell colSpan={1} className="p-0">
                          (kg)
                        </TableCell>
                        <TableCell colSpan={3}>
                          <InputField
                            variant="solid-border"
                            inputClassName="w-full"
                          />
                        </TableCell>
                        <TableCell colSpan={1} className="p-0">
                          (lb)
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={4}>Respiratory Rate</TableCell>
                        <TableCell colSpan={6}>
                          <InputField
                            variant="solid-border"
                            inputClassName="w-full"
                          />
                        </TableCell>
                        <TableCell colSpan={2} className="p-0">
                          /min
                        </TableCell>

                        <TableCell colSpan={3}>BMI</TableCell>
                        <TableCell colSpan={7}>
                          <InputField
                            variant="solid-border"
                            inputClassName="w-full"
                          />
                        </TableCell>
                        <TableCell colSpan={1} className="p-0"></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={4}>Visual Acuity</TableCell>
                        <TableCell colSpan={3}>
                          <InputField
                            variant="solid-border"
                            inputClassName="w-full"
                          />
                        </TableCell>
                        <TableCell colSpan={3}>
                          <InputField
                            variant="solid-border"
                            inputClassName="w-full"
                          />
                        </TableCell>
                        <TableCell colSpan={2} className="p-0"></TableCell>

                        <TableCell colSpan={3}>Temperature</TableCell>
                        <TableCell colSpan={7}>
                          <InputField
                            variant="solid-border"
                            inputClassName="w-full"
                          />
                        </TableCell>
                        <TableCell colSpan={1} className="p-0">
                          °C
                        </TableCell>
                      </TableRow>

                      <TableRow className="border-0">
                        <TableCell colSpan={24} className="text-left font-bold">
                          Pediatric Client aged 0-24 months
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={7}>
                          Length:
                          <InputField
                            variant="solid-border"
                            inputClassName="w-full"
                          />
                        </TableCell>
                        <TableCell colSpan={1} className="p-0 align-bottom">
                          (cm)
                        </TableCell>

                        <TableCell colSpan={7}>
                          Head Circumference:
                          <InputField
                            variant="solid-border"
                            inputClassName="w-full"
                          />
                        </TableCell>
                        <TableCell colSpan={1} className="p-0 align-bottom">
                          (cm)
                        </TableCell>

                        <TableCell colSpan={7}>
                          Skinfold Thickness:
                          <InputField
                            variant="solid-border"
                            inputClassName="w-full"
                          />
                        </TableCell>
                        <TableCell colSpan={1} className="p-0 align-bottom">
                          (cm)
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={24} className="text-left font-bold">
                          Body Circumference:
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={7}>
                          Waist:
                          <InputField
                            variant="solid-border"
                            inputClassName="w-full"
                          />
                        </TableCell>
                        <TableCell colSpan={1} className="p-0 align-bottom">
                          (cm)
                        </TableCell>

                        <TableCell colSpan={7}>
                          Hip:
                          <InputField
                            variant="solid-border"
                            inputClassName="w-full"
                          />
                        </TableCell>
                        <TableCell colSpan={1} className="p-0 align-bottom">
                          (cm)
                        </TableCell>

                        <TableCell colSpan={7}>
                          Limbs:
                          <InputField
                            variant="solid-border"
                            inputClassName="w-full"
                          />
                        </TableCell>
                        <TableCell colSpan={1} className="p-0 align-bottom">
                          (cm)
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={7}>
                          Middle Upper Arm
                          <br />
                          Circumference (MUAC)
                          <InputField
                            variant="solid-border"
                            inputClassName="w-full"
                          />
                        </TableCell>
                        <TableCell colSpan={1} className="p-0 align-bottom">
                          (cm)
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={24} className="text-left font-bold">
                          Blood Type (as available)
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={3}>
                          <SelectionMarker
                            isChecked={false}
                            variant="circle"
                            size="sm"
                            textScale={false}
                            textClassName="font-normal text-[12px] py-1"
                          >
                            A+
                          </SelectionMarker>
                        </TableCell>
                        <TableCell colSpan={3}>
                          <SelectionMarker
                            isChecked={false}
                            variant="circle"
                            size="sm"
                            textScale={false}
                            textClassName="font-normal text-[12px] py-1"
                          >
                            B+
                          </SelectionMarker>
                        </TableCell>
                        <TableCell colSpan={3}>
                          <SelectionMarker
                            isChecked={false}
                            variant="circle"
                            size="sm"
                            textScale={false}
                            textClassName="font-normal text-[12px] py-1"
                          >
                            AB+
                          </SelectionMarker>
                        </TableCell>
                        <TableCell colSpan={3}>
                          <SelectionMarker
                            isChecked={false}
                            variant="circle"
                            size="sm"
                            textScale={false}
                            textClassName="font-normal text-[12px] py-1"
                          >
                            O+
                          </SelectionMarker>
                        </TableCell>
                        <TableCell colSpan={3}>
                          <SelectionMarker
                            isChecked={false}
                            variant="circle"
                            size="sm"
                            textScale={false}
                            textClassName="font-normal text-[12px] py-1"
                          >
                            A-
                          </SelectionMarker>
                        </TableCell>
                        <TableCell colSpan={3}>
                          <SelectionMarker
                            isChecked={false}
                            variant="circle"
                            size="sm"
                            textScale={false}
                            textClassName="font-normal text-[12px] py-1"
                          >
                            B-
                          </SelectionMarker>
                        </TableCell>
                        <TableCell colSpan={3}>
                          <SelectionMarker
                            isChecked={false}
                            variant="circle"
                            size="sm"
                            textScale={false}
                            textClassName="font-normal text-[12px] py-1"
                          >
                            AB-
                          </SelectionMarker>
                        </TableCell>
                        <TableCell colSpan={3}>
                          <SelectionMarker
                            isChecked={false}
                            variant="circle"
                            size="sm"
                            textScale={false}
                            textClassName="font-normal text-[12px] py-1"
                          >
                            O-
                          </SelectionMarker>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={4}>General Survey:</TableCell>
                        <TableCell colSpan={4}>
                          <SelectionMarker
                            isChecked={false}
                            variant="circle"
                            size="sm"
                            textScale={false}
                            textClassName="font-normal text-[12px] py-1"
                          >
                            Awake and alert
                          </SelectionMarker>
                        </TableCell>
                        <TableCell colSpan={5}>
                          <SelectionMarker
                            isChecked={false}
                            variant="circle"
                            size="sm"
                            textScale={false}
                            textClassName="font-normal text-[12px] py-1"
                          >
                            Altered Sensorium
                          </SelectionMarker>
                        </TableCell>
                        <TableCell colSpan={11}>
                          <InputField
                            variant="solid-border"
                            inputClassName="w-full"
                          />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  <Table
                    className="w-full mb-2 border-collapse"
                    style={{
                      tableLayout: "fixed",
                      borderCollapse: "collapse",
                      boxSizing: "border-box",
                      border: "2px solid #000000",
                      maxWidth: "880px",
                    }}
                  >
                    <TableBody>
                      <TableRow>
                        <TableCell colSpan={24}>
                          Note: PhilHealth shall issue an advisory when the
                          Konsulta information system has already been updated
                          to incorporate
                          <br />
                          the information on this FPE form. Until them,
                          PhilHealth Konsulta Providers should use the old FPE
                          form.
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={24} className="h-4"></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={24}>
                          This form may be reproduced and is not for sale.
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={24} className="text-right">
                          Page 2 of 2 of Annex G
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default FPE2024;
