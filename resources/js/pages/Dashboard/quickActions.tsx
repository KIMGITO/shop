import { Button } from "@/components/ui/button";
import { quickActions } from "./data";

export default function DashboardQuickActions () {
    return (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {quickActions.map((action, index) => (
                <Button
                    key={index}
                    variant="outline"
                    className={`flex h-16 flex-col items-center justify-center gap-1 p-2 hover:${action.color} hover:opacity-80`}
                    onClick={action.action}
                >
                    <div className={`rounded-full p-2 ${action.color} hover:animate-pulse`}>{action.icon}</div>
                    <span className="text-xs font-medium">{action.label}</span>
                </Button>
            ))}
        </div>
    );
}