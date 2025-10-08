import { RectangleVertical, Square } from "lucide-react";

interface Props {
  scale: any;
  member: any;
}

function formatDateShort(isoDate: string | undefined): string {
  if (!isoDate) return "N/A";

  const date = new Date(isoDate);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const yyyy = String(date.getFullYear());

  return `${mm}/${dd}/${yyyy}`; // now returns MM/DD/YYYY
}

export default function PMRFContent({ scale, member }: Props) {
  return (
    <div
      className="print-area transition-transform duration-300 ease-in-out p-5"
      style={{
        transform: `scale(${scale})`,
        transformOrigin: "center center",
        width: "1080px",
        height: "550px",
        margin: "0 auto",
      }}
    >
      {/* Form container with background image */}
      <div
        className="relative h-[1450px] bg-white shadow-2xl rounded-lg overflow-hidden mx-auto uppercase"
        style={{
          backgroundImage: `url('/template/pmrf/pmrf_solo_1.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* PIN */}
        <div className="mt-[95px] ml-[675px] w-[365px]">
          {(() => {
            const value =
              member?.person?.identifications?.find(
                (id: any) => id.type === "philhealth_identification_number"
              )?.value || "N/A";

            const chars = [...value];

            const grouped = [];
            for (let i = 0; i < chars.length; i += 4) {
              grouped.push(chars.slice(i, i + 4));
            }

            return grouped.map((group, groupIndex) => (
              <span key={groupIndex} style={{ marginLeft: "11px" }}>
                {group.map((char, charIndex) => (
                  <div className="w-[26px] inline-block">
                    <span key={charIndex}>{char}</span>
                  </div>
                ))}
              </span>
            ));
          })()}
        </div>

        {/* PURPOSE */}
        <div className="flex mt-[62px] ml-[625px]">
          <span className="w-[18px]">
            <RectangleVertical fill="black" size={18} strokeWidth={4} />
          </span>
          <span className="w-[18px] ml-[142px]">
            <RectangleVertical fill="black" size={18} strokeWidth={5} />
          </span>
        </div>

        {/* PREFERED KONSULTA */}
        <div className="mt-[33px] ml-[628px] w-[380px]">
          <span>KONSULTA</span>
        </div>

        {/* MEMBER */}
        <div className="flex mt-[85px] ml-[150px]">
          <span className="w-[223px]">{member?.person?.lastName || "N/A"}</span>
          <span className="w-[220px] ml-[12px]">
            {member?.person?.firstName || "N/A"}
          </span>
          <span className="w-[60px] ml-[13px]">JR</span>
          <span className="w-[220px] ml-[13px]">
            {member?.person?.middleName || "N/A"}
          </span>
          <span className="mt-[3px] ml-[22px]">
            <Square fill={"black"} size={20}></Square>
          </span>
          <span className="mt-[3px] ml-[31px]">
            <Square fill={"black"} size={20}></Square>
          </span>
        </div>

        {/* MOTHER */}
        <div className="flex mt-[16px] ml-[150px]">
          <span className="w-[223px]">{member?.person?.lastName || "N/A"}</span>
          <span className="w-[220px] ml-[12px]">
            {member?.person?.firstName || "N/A"}
          </span>
          <span className="w-[60px] ml-[13px]">JR</span>
          <span className="w-[220px] ml-[13px]">
            {member?.person?.middleName || "N/A"}
          </span>
          <span className="ml-[22px]">
            <Square fill={"black"} size={20}></Square>
          </span>
          <span className="ml-[31px]">
            <Square fill={"black"} size={20}></Square>
          </span>
        </div>

        {/* SPOUSE */}
        <div className="flex mt-[19px] ml-[150px]">
          <span className="w-[223px]">{member?.person?.lastName || "N/A"}</span>
          <span className="w-[220px] ml-[12px]">
            {member?.person?.firstName || "N/A"}
          </span>
          <span className="w-[60px] ml-[13px]">JR</span>
          <span className="w-[220px] ml-[13px]">
            {member?.person?.middleName || "N/A"}
          </span>
          <span className="ml-[22px]">
            <Square fill={"black"} size={20}></Square>
          </span>
          <span className="ml-[31px]">
            <Square fill={"black"} size={20}></Square>
          </span>
        </div>

        {/* DATE OF BIRTH */}
        <div className="flex ml-[33px] mt-[42px]">
          <div className="flex w-[235px] gap-[7px]">
            {(() => {
              const formatted = formatDateShort(member?.person?.birthDate); // e.g., "06/25/90"
              const [mm, dd, yy] = formatted.split("/"); // ['06', '25', '90']
              const parts = [mm, dd, yy];

              return parts.map((part, partIndex) => (
                <div key={partIndex} className="flex gap-[2px]">
                  {[...part].map((char, charIndex) => (
                    <div
                      className="w-[26px] inline-block text-center"
                      key={charIndex}
                    >
                      <span>{char}</span>
                    </div>
                  ))}
                </div>
              ));
            })()}
          </div>
          <div className="ml-[18px] w-[375px] mt-[10px]">
            <span>{member?.person?.birthPlace || "N/A"}</span>
          </div>
          <div className="flex w-[355px] mt-[13px] ml-[13px]">
            {(() => {
              const chars = "000000000000";

              const grouped = [];
              for (let i = 0; i < chars.length; i += 4) {
                grouped.push(chars.slice(i, i + 4));
              }

              return grouped.map((group, groupIndex) => (
                <span key={groupIndex} style={{ marginLeft: "12px" }}>
                  {group.split("").map((char, charIndex) => (
                    <div key={charIndex} className="w-[26px] inline-block">
                      <span>{char}</span>
                    </div>
                  ))}
                </span>
              ));
            })()}
          </div>
        </div>

        {/* SEX */}
        <div className="flex ml-[29px] mt-[45px]">
          <div>
            <span className="block">
              <Square fill={"black"} size={18} />
            </span>
            <span className="block mt-[5px]">
              <Square fill={"black"} size={18} />
            </span>
          </div>

          {/* CIVIL STATUS */}
          <div className="ml-[62px] mt-[-4px]">
            <span className="block">
              <Square fill={"black"} size={18} />
            </span>
            <span className="block mt-[3px]">
              <Square fill={"black"} size={18} />
            </span>
            <span className="block mt-[2px]">
              <Square fill={"black"} size={18} />
            </span>
          </div>

          {/* CIVIL STATUS */}
          <div className="ml-[67px] mt-[-4px]">
            <span className="block">
              <Square fill={"black"} size={18} />
            </span>
            <span className="block mt-[3px]">
              <Square fill={"black"} size={18} />
            </span>
          </div>

          {/* CITIZENSHIP */}
          <div className="ml-[96px]">
            <span className="block">
              <RectangleVertical fill={"black"} size={22} />
            </span>
            <span className="block mt-[5px] ml-[1px]">
              <RectangleVertical fill={"black"} size={21} />
            </span>
          </div>
          <div className="ml-[134px]">
            <span className="block">
              <RectangleVertical fill={"black"} size={22} />
            </span>
          </div>
          <div className="flex w-[355px] mt-[8px] ml-[187px]">
            {(() => {
              const chars = "000000000";

              const grouped = [];
              for (let i = 0; i < chars.length; i += 3) {
                grouped.push(chars.slice(i, i + 3));
              }

              return grouped.map((group, groupIndex) => (
                <span key={groupIndex} style={{ marginLeft: "11px" }}>
                  {group.split("").map((char, charIndex) => (
                    <div key={charIndex} className="w-[26px] inline-block">
                      <span>{char}</span>
                    </div>
                  ))}
                </span>
              ));
            })()}
          </div>
        </div>

        {/* ADDRESS & CONTACT DETAILS */}
        <div className="flex mt-[72px] ml-[28px]">
          <div>
            <div className="flex">
              <span className="w-[120px]">TEST</span>
              <span className="w-[90px] ml-[17px]">TEST</span>
              <span className="w-[190px] ml-[20px]">TEST</span>
              <span className="w-[175px] ml-[60px]">TEST</span>
            </div>
            <div className="flex mt-[30px]">
              <span className="w-[120px]">TEST</span>
              <span className="w-[122px]">TEST</span>
              <span className="w-[120px]">TEST</span>
              <span className="w-[210px]">TEST</span>
              <span className="w-[75px] ml-[30px]">TEST</span>
            </div>
            <div className="flex mt-[5px] ml-[168px]">
              <Square fill={"black"} size={18} />
            </div>
            <div className="flex mt-[20px]">
              <span className="w-[125px]">TEST</span>
              <span className="w-[90px] ml-[15px]">TEST</span>
              <span className="w-[190px] ml-[18px]">TEST</span>
              <span className="w-[178px] ml-[57px]">TEST</span>
            </div>
            <div className="flex mt-[30px]">
              <span className="w-[120px]">TEST</span>
              <span className="w-[122px]">TEST</span>
              <span className="w-[120px]">TEST</span>
              <span className="w-[210px]">TEST</span>
              <span className="w-[75px] ml-[30px]">TEST</span>
            </div>
          </div>
          <div>
            <div className="flex flex-col mt-[-9px] ml-[15px]">
              <span className="w-[290px]">TEST</span>
              <span className="w-[290px] mt-[48px]">TEST</span>
              <span className="w-[290px] mt-[29px]">TEST</span>
              <span className="w-[290px] mt-[27px]">TEST</span>
            </div>
          </div>
        </div>

        {/* DECLARATION OF DEPENDENTS */}
        <div className="mt-[100px]">
          {/* DEPENDENTS - 1 */}
          <div className="flex ml-[29px] w-[990px]">
            <span className="w-[175px]">LAST NAME</span>
            <span className="w-[192px] ml-[10px]">FIRST NAME</span>
            <span className="w-[48px] ml-[10px]">EXT</span>
            <span className="w-[173px] ml-[10px]">MIDDLE NAME</span>
            <span className="w-[72px] ml-[10px]">SON</span>
            <span className="w-[69px] ml-[10px]">DOB</span>
            <span className="w-[56px] ml-[10px]">CIT</span>
            <div className="flex ml-[20px] mt-[4px]">
              <span>
                <Square fill={"black"} size={18} />
              </span>
              <span className="ml-[30px]">
                <Square fill={"black"} size={18} />
              </span>
              <span className="ml-[30px]">
                <Square fill={"black"} size={18} />
              </span>
            </div>
          </div>
          <div className="flex ml-[29px] w-[990px] mt-[10px]">
            <span className="w-[175px]">LAST NAME</span>
            <span className="w-[192px] ml-[10px]">FIRST NAME</span>
            <span className="w-[48px] ml-[10px]">EXT</span>
            <span className="w-[173px] ml-[10px]">MIDDLE NAME</span>
            <span className="w-[72px] ml-[10px]">SON</span>
            <span className="w-[69px] ml-[10px]">DOB</span>
            <span className="w-[56px] ml-[10px]">CIT</span>
            <div className="flex ml-[20px] mt-[4px]">
              <span>
                <Square fill={"black"} size={18} />
              </span>
              <span className="ml-[30px]">
                <Square fill={"black"} size={18} />
              </span>
              <span className="ml-[30px]">
                <Square fill={"black"} size={18} />
              </span>
            </div>
          </div>
          <div className="flex ml-[29px] w-[990px] mt-[10px]">
            <span className="w-[175px]">LAST NAME</span>
            <span className="w-[192px] ml-[10px]">FIRST NAME</span>
            <span className="w-[48px] ml-[10px]">EXT</span>
            <span className="w-[173px] ml-[10px]">MIDDLE NAME</span>
            <span className="w-[72px] ml-[10px]">SON</span>
            <span className="w-[69px] ml-[10px]">DOB</span>
            <span className="w-[56px] ml-[10px]">CIT</span>
            <div className="flex ml-[20px] mt-[4px]">
              <span>
                <Square fill={"black"} size={18} />
              </span>
              <span className="ml-[30px]">
                <Square fill={"black"} size={18} />
              </span>
              <span className="ml-[30px]">
                <Square fill={"black"} size={18} />
              </span>
            </div>
          </div>
          <div className="flex ml-[29px] w-[990px] mt-[10px]">
            <span className="w-[175px]">LAST NAME</span>
            <span className="w-[192px] ml-[10px]">FIRST NAME</span>
            <span className="w-[48px] ml-[10px]">EXT</span>
            <span className="w-[173px] ml-[10px]">MIDDLE NAME</span>
            <span className="w-[72px] ml-[10px]">SON</span>
            <span className="w-[69px] ml-[10px]">DOB</span>
            <span className="w-[56px] ml-[10px]">CIT</span>
            <div className="flex ml-[20px] mt-[1px]">
              <span>
                <Square fill={"black"} size={18} />
              </span>
              <span className="ml-[30px]">
                <Square fill={"black"} size={18} />
              </span>
              <span className="ml-[30px]">
                <Square fill={"black"} size={18} />
              </span>
            </div>
          </div>
        </div>

        {/* MEMBER TYPE */}
        <div className="flex mt-[68px] ml-[25px]">
          {/* DIRECT CONTRIBUTOR */}
          <div className="w-[645px]">
            <div className="flex ml-[7px]">
              <span className="w-[18px]">
                <Square fill={"black"} size={18} />
              </span>
              <span className="w-[18px] ml-[237px]">
                <Square fill={"black"} size={18} />
              </span>
              <span className="w-[18px] ml-[146px]">
                <Square fill={"black"} size={18} />
              </span>
            </div>
            <div className="flex ml-[7px] mt-[4px]">
              <span className="w-[18px]">
                <Square fill={"black"} size={18} />
              </span>
              <span className="w-[18px] ml-[237px]">
                <Square fill={"black"} size={18} />
              </span>
            </div>
            <div className="flex ml-[7px] mt-[4px]">
              <span className="w-[18px]">
                <Square fill={"black"} size={18} />
              </span>
              <span className="w-[18px] ml-[262px]">
                <Square fill={"black"} size={18} />
              </span>
              <span className="w-[18px] ml-[122px]">
                <Square fill={"black"} size={18} />
              </span>
            </div>
            <div className="flex ml-[7px] mt-[4px]">
              <span className="w-[18px] mt-[2px]">
                <Square fill={"black"} size={18} />
              </span>
              <span className="w-[18px] ml-[237px]">
                <Square fill={"black"} size={18} />
              </span>
            </div>
            <div className="flex ml-[7px] mt-[4px]">
              <span className="w-[18px] mt-[2px] ml-[16px]">
                <Square fill={"black"} size={18} />
              </span>
              <span className="w-[18px] ml-[221px]">
                <Square fill={"black"} size={18} />
              </span>
            </div>
            <div className="flex ml-[7px] mt-[2px]">
              <span className="w-[18px] mt-[2px] ml-[16px]">
                <Square fill={"black"} size={18} />
              </span>
              <span className="w-[18px] ml-[221px]">
                <Square fill={"black"} size={18} />
              </span>
            </div>
            <div className="flex ml-[7px] mt-[2px]">
              <span className="w-[18px] mt-[2px] ml-[16px]">
                <Square fill={"black"} size={18} />
              </span>
              <span className="w-[188px] ml-[360px]">TEST</span>
            </div>
            <div className="flex ml-[7px] mt-[2px]">
              <span className="w-[176px] ml-[40px]">TEST</span>
              <span className="w-[176px] ml-[177px] mt-[-4px]">TEST</span>
            </div>
            <div className="flex mt-[48px]">
              <span className="w-[305px] ml-[3px]">PROFESSION</span>
              <span className="w-[105px] ml-[10px]">MONTHLY</span>
              <span className="w-[160px] ml-[10px]">PROOF</span>
            </div>
          </div>

          {/* INDIRECT CONTRIBUTOR */}
          <div className="w-[350px]">
            <div className="flex mt-[10px] ml-[10px]">
              <span className="w-[18px]">
                <Square fill={"black"} size={18} />
              </span>
              <span className="w-[18px] ml-[115px]">
                <Square fill={"black"} size={18} />
              </span>
            </div>
            <div className="flex mt-[6px] ml-[10px]">
              <span className="w-[18px]">
                <Square fill={"black"} size={18} />
              </span>
              <span className="w-[18px] ml-[115px]">
                <Square fill={"black"} size={18} />
              </span>
            </div>
            <div className="flex mt-[6px] ml-[10px]">
              <span className="w-[18px]">
                <Square fill={"black"} size={18} />
              </span>
              <span className="w-[18px] ml-[115px] mt-[-3px]">
                <Square fill={"black"} size={18} />
              </span>
            </div>
            <div className="flex mt-[6px] ml-[10px]">
              <span className="w-[18px]">
                <Square fill={"black"} size={18} />
              </span>
              <span className="w-[18px] ml-[115px] mt-[-3px]">
                <Square fill={"black"} size={18} />
              </span>
            </div>
            <div className="flex mt-[6px] ml-[10px]">
              <span className="w-[18px]">
                <Square fill={"black"} size={18} />
              </span>
              <span className="w-[113px] ml-[200px] mt-[-3px]">TEST</span>
            </div>
            <div className="flex mt-[7px] ml-[10px]">
              <span className="w-[18px]">
                <Square fill={"black"} size={18} />
              </span>
            </div>
          </div>
        </div>
      </div>
      <div
        className="fpe-page page-2 relative h-[1450px] bg-white shadow-2xl rounded-lg overflow-hidden mx-auto text-base uppercase"
        style={{
          backgroundImage: `url('/template/pmrf/pmrf_solo_2.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="flex mt-[60px]">
          <div>
            <div className="flex mt-[9px] ml-[17px]">
              <span>
                <Square fill={"black"} size={18} />
              </span>
              <span className="ml-[322px] w-[330px]">TEST FROM</span>
              <span className="ml-[15px] w-[310px]">TEST TO</span>
            </div>
            <div className="flex mt-[20px] ml-[17px]">
              <span>
                <Square fill={"black"} size={18} />
              </span>
              <span className="ml-[322px] w-[330px]">TEST FROM</span>
              <span className="ml-[15px] w-[310px]">TEST TO</span>
            </div>
            <div className="flex mt-[21px] ml-[17px]">
              <span>
                <Square fill={"black"} size={18} />
              </span>
              <span className="ml-[322px] w-[330px]">TEST FROM</span>
              <span className="ml-[15px] w-[310px]">TEST TO</span>
            </div>
            <div className="flex mt-[23px] ml-[16px]">
              <span>
                <Square fill={"black"} size={18} />
              </span>
              <span className="ml-[322px] w-[330px]">TEST FROM</span>
              <span className="ml-[15px] w-[310px]">TEST TO</span>
            </div>
            <div className="flex mt-[25px] ml-[16px]">
              <span>
                <Square fill={"black"} size={18} />
              </span>
              <span className="ml-[322px] w-[330px]">TEST FROM</span>
              <span className="ml-[15px] w-[310px]">TEST TO</span>
            </div>
          </div>
        </div>

        <div className="flex mt-[307px] ml-[27px]">
          <div className="w-[347px]">
            <span className="text-[11px]">
              {`${member?.person?.firstName || "N/A"}
              ${member?.person?.middleName || "N/A"}
              ${member?.person?.lastName || "N/A"}`}
            </span>
          </div>
          <div className="w-[120px] ml-[17px]">
            <span>{formatDateShort(member?.person?.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
