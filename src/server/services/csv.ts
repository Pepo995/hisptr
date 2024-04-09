import { json2csv } from "json-2-csv";
import { type NextApiResponse } from "next";

type DataCell = string | number | null | boolean | Date | undefined;
type DataRow = Record<string, DataCell>;

export const exportToCsv = (dataToCsv: DataRow[], res: NextApiResponse, fileName: string) => {
  const csv = json2csv(dataToCsv);

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename=${fileName}.csv`);
  res.send(csv);
};
