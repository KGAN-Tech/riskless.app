import {
FileText,
} from "lucide-react";
import { Card } from "@/components/atoms/card";
import { useNavigate } from "react-router";
  
const generator = [
    {
        name: "XML",
        path: "/konsulta/generator/xml",
        icon: <FileText className="w-12 h-12 text-blue-500" />,
    },
    {
        name: "JSON",
        path: "/konsulta/generator/json",
        icon: <FileText className="w-12 h-12 text-blue-500" />,
    },
];

export default function GeneratorPage() {
const navigate = useNavigate();

    return (
        <div className="space-y-4 px-4 py-6">
            <div className="border-b pb-2">
                <h1 className="text-2xl font-semibold text-gray-800  border-gray-200 ">
                Generator
                </h1>
                <p className="text-sm text-gray-500">
                Choose the module of generator you want to use.
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {generator.map((item) => (
                <Card
                    key={item.name}
                    className="px-4 py-8 cursor-pointer transition hover:shadow-md hover:bg-gray-50"
                    onClick={() => navigate(item.path)}
                >
                    <div className="flex flex-col items-center justify-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-full ">{item.icon}</div>
                    <p className="text-lg font-medium text-gray-700 text-center">
                        {item.name}
                    </p>
                    </div>
                </Card>
                ))}
            </div>
        </div>
    );
}