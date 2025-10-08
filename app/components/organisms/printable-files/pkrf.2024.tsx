import LabelField from "./components/label.field";
import InputField from "./components/input.field";
import CheckboxTypeField from "./components/selection.marker";
import { SpanFormat } from "./components/span.format";
import PhHeader from "./components/ph-header.jpg";
import { HiMiniScissors } from "react-icons/hi2";

import { Printer } from "lucide-react";
import { useRef } from "react";

import { Button } from "@/components/atoms/button";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/atoms/table";
import * as ReactToPrint from "react-to-print";

// Define mockData locally for testing purposes in this file
const mockData = {
  pin: "123-456-789",
  date: "03/15/2024",
  fullName: {
    last: "DOE",
    first: "JANE",
    middle: "M",
  },
  address: "Barangay Sample, Sample City, Sample Province",
  dob: "01/01/1980",
  contactNo: "09171234567",
  memberType: "MEMBER", // or 'DEPENDENT'
  firstChoiceKPP: "Sample Health Center 1",
  secondChoiceKPP: "Sample Health Center 2",
  previousKPP: "Old Health Center",
  kpp: "Assigned Health Center",
  authorizedPersonnel: {
    last: "SMITH",
    first: "JOHN",
    middle: "A",
  },
};

const PKFR2024 = () => {
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
          className="bg-white text-[11px] max-w-[800px] m-auto print:border-0"
          style={{ boxSizing: "border-box" }}
        >
          <Table className="print:border-0">
            <TableBody className="print:border-0">
              <TableRow className="border-0 print:border-0">
                <TableCell
                  className="border-none p-0 text-right align-top print:border-0"
                  colSpan={24}
                >
                  <div className="flex flex-col items-end">
                    <span
                      className="px-2 py-0.5 font-bold text-[20px]"
                      style={{ display: "inline-block" }}
                    >
                      Annex A: PhilHealth Konsulta Registration Form
                    </span>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow className="border-0 print:border-0">
                <TableCell colSpan={24}>
                  <br />
                </TableCell>
              </TableRow>
              <TableRow className="border-0 print:border-0">
                <TableCell colSpan={8}>
                  <Table
                    className="w-full border-collapse print:border-0"
                    style={{
                      tableLayout: "fixed",
                      borderCollapse: "collapse",
                      boxSizing: "border-box",
                      border: "1px solid #000000",
                      maxWidth: "330px",
                    }}
                  >
                    <TableBody className="print:border-0">
                      <TableRow className="border-0">
                        <TableCell colSpan={24} className="p-1">
                          <img src={PhHeader} alt="" />
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell className="border-none p-0" colSpan={24}>
                          <div className="flex flex-col">
                            <div className="pb-2 leading-[1.1em] font-impact text-[8px] font-semibold">
                              <ol className="list-decimal ml-4">
                                <li>
                                  All information should be written in UPPER
                                  CASE/CAPITAL LETTER.
                                </li>
                                <li>All fields are mandatory.</li>
                                <li>
                                  If the beneficiary is dependent, use the
                                  dependent PIN.
                                </li>
                                <li>
                                  If the beneficiary is below 21 years old, the
                                  signatory should be the parent/guardian.
                                </li>
                              </ol>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell className="border-none p-0" colSpan={24}>
                          <div className="bg-gradient-to-t from-blue-300 to-blue-100 text-black font-bold uppercase tracking-wide shadow-md text-[12px] border-t-[0.5px] border-gray-700 print:border-0 print:bg-none">
                            <div className="border-b-[3px] border-gray-400">
                              <div className="scale-x-[0.85] ml-[-20px]">
                                TO BE FILLED-OUT BY THE BENEFICIARY
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell
                          colSpan={14}
                          className="border-none p-2 align-top"
                        >
                          <CheckboxTypeField
                            isChecked={true}
                            textClassName="ml-[-5px]"
                          >
                            MEMBER
                          </CheckboxTypeField>
                        </TableCell>
                        <TableCell
                          colSpan={10}
                          className="border-none p-2 align-top"
                        >
                          <CheckboxTypeField
                            isChecked={false}
                            textClassName="ml-[-5px]"
                          >
                            DEPENDENT
                          </CheckboxTypeField>
                        </TableCell>
                      </TableRow>

                      {/* PIN - DATE */}
                      <TableRow className="border-0">
                        <TableCell colSpan={2}>
                          <LabelField label="PIN" />
                        </TableCell>
                        <TableCell colSpan={12}>
                          <InputField
                            placeHolder={mockData.pin}
                            variant="underline-dotted"
                            inputClassName="w-full"
                          />
                        </TableCell>
                        <TableCell colSpan={2}>
                          <LabelField label="DATE" />
                        </TableCell>
                        <TableCell colSpan={8}>
                          <InputField
                            placeHolder={mockData.date}
                            variant="underline-dotted"
                            inputClassName="w-full"
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={16}></TableCell>
                        <TableCell
                          colSpan={8}
                          className="align-top text-center"
                        >
                          <SpanFormat variant={"gradient"}>
                            MM/DD/YYYY
                          </SpanFormat>
                        </TableCell>
                      </TableRow>

                      {/* FULL NAME */}
                      <TableRow className="border-0">
                        <TableCell colSpan={4} className="p-0">
                          <LabelField label="FULL NAME" />
                        </TableCell>
                        <TableCell colSpan={20} className="align-bottom">
                          <InputField
                            placeHolder={`${mockData.fullName.last} ${mockData.fullName.first} ${mockData.fullName.middle}`}
                            variant="underline-dotted"
                            inputClassName="w-full"
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={5}></TableCell>
                        <TableCell
                          colSpan={5}
                          className="align-top text-center"
                        >
                          <SpanFormat
                            variant={"gradient"}
                            className="mr-3 print:border-0"
                          >
                            LAST NAME
                          </SpanFormat>
                        </TableCell>
                        <TableCell
                          colSpan={7}
                          className="align-top text-center"
                        >
                          <SpanFormat
                            variant={"gradient"}
                            className="mr-3 print:border-0"
                          >
                            FIRST NAME
                          </SpanFormat>
                        </TableCell>
                        <TableCell
                          colSpan={7}
                          className="align-top text-center"
                        >
                          <SpanFormat
                            variant={"gradient"}
                            className="mr-3 print:border-0"
                          >
                            MIDDLE NAME
                          </SpanFormat>
                        </TableCell>
                      </TableRow>

                      {/* ADDRESS - FULL */}
                      <TableRow className="border-0">
                        <TableCell colSpan={3} className="px-1">
                          <LabelField label="ADDRESS" />
                        </TableCell>
                        <TableCell colSpan={21} className="align-bottom">
                          <InputField
                            placeHolder={mockData.address}
                            variant="underline-dotted"
                            inputClassName="w-full"
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={4}></TableCell>
                        <TableCell
                          colSpan={7}
                          className="align-top text-center"
                        >
                          <SpanFormat
                            variant={"gradient"}
                            className="mr-3 print:border-0"
                          >
                            BARANGAY/TOWN
                          </SpanFormat>
                        </TableCell>
                        <TableCell
                          colSpan={7}
                          className="align-top text-center"
                        >
                          <SpanFormat
                            variant={"gradient"}
                            className="mr-3 print:border-0"
                          >
                            MUNICIPALITY/CITY
                          </SpanFormat>
                        </TableCell>
                        <TableCell
                          colSpan={6}
                          className="align-top text-center"
                        >
                          <SpanFormat
                            variant={"gradient"}
                            className="mr-3 print:border-0"
                          >
                            PROVINCE
                          </SpanFormat>
                        </TableCell>
                      </TableRow>

                      {/* DATE OF BIRTH - CONTACT NO. */}
                      <TableRow className="border-0">
                        <TableCell colSpan={5} className="px-0">
                          <LabelField label="DATE OF BIRTH" />
                        </TableCell>
                        <TableCell colSpan={9}>
                          <InputField
                            placeHolder={mockData.dob}
                            variant="underline-dotted"
                            inputClassName="w-full"
                          />
                        </TableCell>
                        <TableCell colSpan={5}>
                          <LabelField label="CONTACT NO." />
                        </TableCell>
                        <TableCell colSpan={5}>
                          <InputField
                            placeHolder={mockData.contactNo}
                            variant="underline-dotted"
                            inputClassName="w-full"
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={5}></TableCell>
                        <TableCell
                          colSpan={9}
                          className="align-top text-center"
                        >
                          <SpanFormat variant={"gradient"}>
                            MM/DD/YYYY
                          </SpanFormat>
                        </TableCell>
                        <TableCell colSpan={10}></TableCell>
                      </TableRow>

                      {/* 2 CHECKBOX  */}
                      <TableRow className="border-0 mb-2">
                        <TableCell
                          colSpan={16}
                          className="border-none align-top"
                        >
                          <CheckboxTypeField
                            isChecked={false}
                            textClassName="ml-[-20px]"
                          >
                            REGISTER TO A KONSULTA PACKAGE PROVIDER (KPP)
                          </CheckboxTypeField>
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell
                          colSpan={16}
                          className="border-none align-top"
                        >
                          <CheckboxTypeField
                            isChecked={false}
                            textClassName="ml-[-20px] mb-[5px]"
                          >
                            REGISTER ALL MY DECLARED MINOR DEPENDENTS
                            <br />
                            (please use additional form if necessary)
                          </CheckboxTypeField>
                        </TableCell>
                      </TableRow>

                      {/* FULL NAME */}
                      <TableRow className="border-0">
                        <TableCell colSpan={4} className="p-0">
                          <LabelField label="FULL NAME" />
                        </TableCell>
                        <TableCell colSpan={20} className="align-bottom">
                          <InputField
                            variant="underline-dotted"
                            inputClassName="w-full"
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={5}></TableCell>
                        <TableCell
                          colSpan={5}
                          className="align-top text-center"
                        >
                          <SpanFormat
                            variant={"gradient"}
                            className="mr-3 print:border-0"
                          >
                            LAST NAME
                          </SpanFormat>
                        </TableCell>
                        <TableCell
                          colSpan={7}
                          className="align-top text-center"
                        >
                          <SpanFormat
                            variant={"gradient"}
                            className="mr-3 print:border-0"
                          >
                            FIRST NAME
                          </SpanFormat>
                        </TableCell>
                        <TableCell
                          colSpan={7}
                          className="align-top text-center"
                        >
                          <SpanFormat
                            variant={"gradient"}
                            className="mr-3 print:border-0"
                          >
                            MIDDLE NAME
                          </SpanFormat>
                        </TableCell>
                      </TableRow>

                      {/* 1ST CHOICE KPP */}
                      <TableRow className="border-0">
                        <TableCell colSpan={5} className="px-0">
                          <LabelField
                            label="1ST CHOICE KPP"
                            className="ml-[-5px]"
                          />
                        </TableCell>
                        <TableCell colSpan={19} className="align-bottom">
                          <InputField
                            placeHolder={mockData.firstChoiceKPP}
                            variant="underline-dotted"
                            inputClassName="w-full"
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={24} className="h-3"></TableCell>
                      </TableRow>

                      {/* ADDRESS - FULL */}
                      <TableRow className="border-0">
                        <TableCell colSpan={3} className="px-1">
                          <LabelField label="ADDRESS" />
                        </TableCell>
                        <TableCell colSpan={21} className="align-bottom">
                          <InputField
                            variant="underline-dotted"
                            inputClassName="w-full"
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={4}></TableCell>
                        <TableCell
                          colSpan={7}
                          className="align-top text-center"
                        >
                          <SpanFormat
                            variant={"gradient"}
                            className="mr-3 print:border-0"
                          >
                            BARANGAY/TOWN
                          </SpanFormat>
                        </TableCell>
                        <TableCell
                          colSpan={7}
                          className="align-top text-center"
                        >
                          <SpanFormat
                            variant={"gradient"}
                            className="mr-3 print:border-0"
                          >
                            MUNICIPALITY/CITY
                          </SpanFormat>
                        </TableCell>
                        <TableCell
                          colSpan={6}
                          className="align-top text-center"
                        >
                          <SpanFormat
                            variant={"gradient"}
                            className="mr-3 print:border-0"
                          >
                            PROVINCE
                          </SpanFormat>
                        </TableCell>
                      </TableRow>

                      {/* 2ND CHOICE KPP */}
                      <TableRow className="border-0">
                        <TableCell colSpan={6} className="px-0">
                          <LabelField
                            label="2ND CHOICE KPP"
                            className="ml-[-5px]"
                          />
                        </TableCell>
                        <TableCell colSpan={18} className="align-bottom">
                          <InputField
                            placeHolder={mockData.secondChoiceKPP}
                            variant="underline-dotted"
                            inputClassName="w-full"
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={24} className="h-3"></TableCell>
                      </TableRow>

                      {/* ADDRESS - FULL */}
                      <TableRow className="border-0">
                        <TableCell colSpan={3} className="px-1">
                          <LabelField label="ADDRESS" />
                        </TableCell>
                        <TableCell colSpan={21} className="align-bottom">
                          <InputField
                            variant="underline-dotted"
                            inputClassName="w-full"
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={4}></TableCell>
                        <TableCell
                          colSpan={7}
                          className="align-top text-center"
                        >
                          <SpanFormat
                            variant={"gradient"}
                            className="mr-3 print:border-0"
                          >
                            BARANGAY/TOWN
                          </SpanFormat>
                        </TableCell>
                        <TableCell
                          colSpan={7}
                          className="align-top text-center"
                        >
                          <SpanFormat
                            variant={"gradient"}
                            className="mr-3 print:border-0"
                          >
                            MUNICIPALITY/CITY
                          </SpanFormat>
                        </TableCell>
                        <TableCell
                          colSpan={6}
                          className="align-top text-center"
                        >
                          <SpanFormat
                            variant={"gradient"}
                            className="mr-3 print:border-0"
                          >
                            PROVINCE
                          </SpanFormat>
                        </TableCell>
                      </TableRow>

                      <TableRow className="border-solid border-black">
                        <TableCell colSpan={24} className="h-2"></TableCell>
                      </TableRow>

                      <TableRow className="border-0">
                        <TableCell
                          colSpan={24}
                          className="border-none p-2 align-top"
                        >
                          <CheckboxTypeField isChecked={false}>
                            TRANSFER
                          </CheckboxTypeField>
                        </TableCell>
                      </TableRow>

                      {/* PREVIOUS KPP */}
                      <TableRow className="border-0">
                        <TableCell colSpan={6} className="px-0">
                          <LabelField
                            label="PREVIOUS KPP"
                            className="ml-[-5px]"
                          />
                        </TableCell>
                        <TableCell colSpan={18} className="align-bottom">
                          <InputField
                            placeHolder={mockData.previousKPP}
                            variant="underline-dotted"
                            inputClassName="w-full"
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={24} className="h-3"></TableCell>
                      </TableRow>

                      {/* 1ST CHOICE KPP */}
                      <TableRow className="border-0">
                        <TableCell colSpan={6} className="px-0">
                          <LabelField
                            label="1ST CHOICE KPP"
                            className="ml-[-5px]"
                          />
                        </TableCell>
                        <TableCell colSpan={18} className="align-bottom">
                          <InputField
                            variant="underline-dotted"
                            inputClassName="w-full"
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={24} className="h-3"></TableCell>
                      </TableRow>

                      {/* ADDRESS - FULL */}
                      <TableRow className="border-0">
                        <TableCell colSpan={3} className="px-1">
                          <LabelField label="ADDRESS" />
                        </TableCell>
                        <TableCell colSpan={21} className="align-bottom">
                          <InputField
                            variant="underline-dotted"
                            inputClassName="w-full"
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={4}></TableCell>
                        <TableCell
                          colSpan={7}
                          className="align-top text-center"
                        >
                          <SpanFormat
                            variant={"gradient"}
                            className="mr-3 print:border-0"
                          >
                            BARANGAY/TOWN
                          </SpanFormat>
                        </TableCell>
                        <TableCell
                          colSpan={7}
                          className="align-top text-center"
                        >
                          <SpanFormat
                            variant={"gradient"}
                            className="mr-3 print:border-0"
                          >
                            MUNICIPALITY/CITY
                          </SpanFormat>
                        </TableCell>
                        <TableCell
                          colSpan={6}
                          className="align-top text-center"
                        >
                          <SpanFormat
                            variant={"gradient"}
                            className="mr-3 print:border-0"
                          >
                            PROVINCE
                          </SpanFormat>
                        </TableCell>
                      </TableRow>

                      {/* 2ND CHOICE KPP */}
                      <TableRow className="border-0">
                        <TableCell colSpan={6} className="px-0">
                          <LabelField
                            label="2ND CHOICE KPP"
                            className="ml-[-5px]"
                          />
                        </TableCell>
                        <TableCell colSpan={18} className="align-bottom">
                          <InputField
                            variant="underline-dotted"
                            inputClassName="w-full"
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={24} className="h-3"></TableCell>
                      </TableRow>

                      {/* ADDRESS - FULL */}
                      <TableRow className="border-0">
                        <TableCell colSpan={3} className="px-1">
                          <LabelField label="ADDRESS" />
                        </TableCell>
                        <TableCell colSpan={21} className="align-bottom">
                          <InputField
                            variant="underline-dotted"
                            inputClassName="w-full"
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={4}></TableCell>
                        <TableCell
                          colSpan={7}
                          className="align-top text-center"
                        >
                          <SpanFormat
                            variant={"gradient"}
                            className="mr-3 print:border-0"
                          >
                            BARANGAY/TOWN
                          </SpanFormat>
                        </TableCell>
                        <TableCell
                          colSpan={7}
                          className="align-top text-center"
                        >
                          <SpanFormat
                            variant={"gradient"}
                            className="mr-3 print:border-0"
                          >
                            MUNICIPALITY/CITY
                          </SpanFormat>
                        </TableCell>
                        <TableCell
                          colSpan={6}
                          className="align-top text-center"
                        >
                          <SpanFormat
                            variant={"gradient"}
                            className="mr-3 print:border-0"
                          >
                            PROVINCE
                          </SpanFormat>
                        </TableCell>
                      </TableRow>

                      <TableRow className="border-0 text-[10px]">
                        <TableCell
                          colSpan={24}
                          className="border-none px-2 py-2 font-bold"
                        >
                          I hereby certify that I did not avail of FPE in other
                          KPP. Moreover, I
                          <br />
                          grant my free and voluntary consent to the collection,
                          transmission
                          <br />
                          and processing of my personal data and health records
                          to PhilHelth
                          <br />
                          for the purpose of paying and monitoring the provider
                          for the Kon-
                          <br />
                          sulta benefit in accordance with Republic Act No.
                          10173, otherwise
                          <br />
                          known as the "Data Privacy Act of 2012".
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={24}>
                          <br />
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={1}></TableCell>
                        <TableCell colSpan={12}>
                          <InputField
                            variant="underline-dotted"
                            inputClassName="w-full"
                          ></InputField>
                        </TableCell>
                        <TableCell colSpan={11}></TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={1}>
                          <br />
                        </TableCell>
                        <TableCell colSpan={12} className="text-center">
                          <SpanFormat variant={"gradient"} className="mr-3">
                            (Signature over Printed Name)
                          </SpanFormat>
                        </TableCell>
                        <TableCell colSpan={11}></TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={16}></TableCell>
                        <TableCell colSpan={8} className="px-1 text-sm">
                          <span className="text-[9px] scale-x-[0.80] text-black font-bold">
                            PHILHEALTH'S COPY
                          </span>
                        </TableCell>
                      </TableRow>

                      {/* SCISSOR - DASHED */}
                      <TableRow>
                        <TableCell colSpan={1}>
                          <HiMiniScissors size={28} />
                        </TableCell>
                        <TableCell colSpan={23}>
                          <InputField
                            variant="middle-dashed"
                            inputClassName="w-full"
                          />
                        </TableCell>
                      </TableRow>

                      {/* FOR PHILHEALTH KONSULTA PERSONNEL */}
                      <TableRow className="border-0">
                        <TableCell className="border-none p-0" colSpan={24}>
                          <div className="bg-gradient-to-t from-blue-300 to-blue-100 text-black font-bold uppercase tracking-wide shadow-md text-[12px] border-t-[0.5px] border-gray-700 print:border-0 print:bg-none">
                            <div className="scale-x-[0.85] ml-[-20px]">
                              TO BE FILLED-OUT BY PHILHEALTH KONSULTA PERSONNEL
                            </div>
                          </div>
                          <div className="border-b-4 border-gray-400/30"></div>
                        </TableCell>
                      </TableRow>

                      {/* REGISTRATION NO. - DATE REGISTERED */}
                      <TableRow className="border-0">
                        <TableCell colSpan={24}>
                          <LabelField label="PHILHEALTH KONSULTA REGISTRATION CONFIRMATION SLIP" />
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={6} className="p-0">
                          <LabelField label="REGISTRATION NO." />
                        </TableCell>
                        <TableCell colSpan={7}>
                          <InputField
                            placeHolder={mockData.pin}
                            variant="underline-dotted"
                            inputClassName="w-full"
                          />
                        </TableCell>
                        <TableCell colSpan={6} className="p-0">
                          <LabelField label="DATE REGISTERED" />
                        </TableCell>
                        <TableCell colSpan={5}>
                          <InputField
                            placeHolder={mockData.date}
                            variant="underline-dotted"
                            inputClassName="w-full"
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={19}></TableCell>
                        <TableCell
                          colSpan={5}
                          className="align-top text-center"
                        >
                          <SpanFormat variant={"gradient"}>
                            MM/DD/YYYY
                          </SpanFormat>
                        </TableCell>
                      </TableRow>

                      {/* FULL NAME */}
                      <TableRow className="border-0">
                        <TableCell colSpan={4} className="p-0">
                          <LabelField label="FULL NAME" />
                        </TableCell>
                        <TableCell colSpan={20} className="align-bottom">
                          <InputField
                            variant="underline-dotted"
                            inputClassName="w-full"
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={5}></TableCell>
                        <TableCell
                          colSpan={5}
                          className="align-top text-center"
                        >
                          <SpanFormat
                            variant={"gradient"}
                            className="mr-3 print:border-0"
                          >
                            LAST NAME
                          </SpanFormat>
                        </TableCell>
                        <TableCell
                          colSpan={7}
                          className="align-top text-center"
                        >
                          <SpanFormat
                            variant={"gradient"}
                            className="mr-3 print:border-0"
                          >
                            FIRST NAME
                          </SpanFormat>
                        </TableCell>
                        <TableCell
                          colSpan={7}
                          className="align-top text-center"
                        >
                          <SpanFormat
                            variant={"gradient"}
                            className="mr-3 print:border-0"
                          >
                            MIDDLE NAME
                          </SpanFormat>
                        </TableCell>
                      </TableRow>

                      {/* PIN - DATE OF BIRTH */}
                      <TableRow className="border-0">
                        <TableCell colSpan={2}>
                          <LabelField label="PIN" />
                        </TableCell>
                        <TableCell colSpan={11}>
                          <InputField
                            placeHolder={mockData.pin}
                            variant="underline-dotted"
                            inputClassName="w-full"
                          />
                        </TableCell>
                        <TableCell colSpan={6} className="p-0">
                          <LabelField label="DATE OF BIRTH" />
                        </TableCell>
                        <TableCell colSpan={5}>
                          <InputField
                            placeHolder={mockData.date}
                            variant="underline-dotted"
                            inputClassName="w-full"
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={19}></TableCell>
                        <TableCell
                          colSpan={5}
                          className="align-top text-center"
                        >
                          <SpanFormat variant={"gradient"}>
                            MM/DD/YYYY
                          </SpanFormat>
                        </TableCell>
                      </TableRow>

                      {/* KPP */}
                      <TableRow className="border-0">
                        <TableCell colSpan={2}>
                          <LabelField label="KPP" className="pb-[10px]" />
                        </TableCell>
                        <TableCell
                          colSpan={22}
                          className="align-bottom pb-[10px]"
                        >
                          <InputField
                            placeHolder={mockData.kpp}
                            variant="underline-dotted"
                            inputClassName="w-full"
                          />
                        </TableCell>
                      </TableRow>

                      {/* ADDRESS - FULL */}
                      <TableRow className="border-0">
                        <TableCell colSpan={3} className="px-1">
                          <LabelField label="ADDRESS" />
                        </TableCell>
                        <TableCell colSpan={21} className="align-bottom">
                          <InputField
                            variant="underline-dotted"
                            inputClassName="w-full"
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={4}></TableCell>
                        <TableCell
                          colSpan={7}
                          className="align-top text-center"
                        >
                          <SpanFormat
                            variant={"gradient"}
                            className="mr-3 print:border-0"
                          >
                            BARANGAY/TOWN
                          </SpanFormat>
                        </TableCell>
                        <TableCell
                          colSpan={7}
                          className="align-top text-center"
                        >
                          <SpanFormat
                            variant={"gradient"}
                            className="mr-3 print:border-0"
                          >
                            MUNICIPALITY/CITY
                          </SpanFormat>
                        </TableCell>
                        <TableCell
                          colSpan={6}
                          className="align-top text-center"
                        >
                          <SpanFormat
                            variant={"gradient"}
                            className="mr-3 print:border-0"
                          >
                            PROVINCE
                          </SpanFormat>
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={24}>
                          <br />
                        </TableCell>
                      </TableRow>

                      <TableRow className="border-0">
                        <TableCell colSpan={1}></TableCell>
                        <TableCell colSpan={15}>
                          <InputField
                            variant="underline-dotted"
                            inputClassName="w-full"
                          ></InputField>
                        </TableCell>
                        <TableCell colSpan={6}></TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={1}>
                          <br />
                        </TableCell>
                        <TableCell colSpan={16} className="text-center">
                          <SpanFormat
                            variant={"gradient"}
                            className="mr-5 text-[7px]"
                          >
                            (Signature over Printed Name of Authorized
                            Personnel)
                          </SpanFormat>
                        </TableCell>
                        <TableCell colSpan={6}></TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={16}>
                          <br />
                        </TableCell>
                        <TableCell colSpan={8} className="px-1 text-sm">
                          <span className="text-[9px] scale-x-[0.80] text-black font-bold">
                            BENEFIARY'S COPY
                          </span>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableCell>
                <TableCell colSpan={16}></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default PKFR2024;
