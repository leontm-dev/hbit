import { ToggleGroup } from "@/components/ui/toggle-group";
import { MatchPopulated } from "../../../main/functions/match/get-all";
import { AccountLevelDistributionOfEnemies } from "./account-level-distribution-of-enemies";

type Props = {
  matches: MatchPopulated[];
};

export type Category = "Account level";
export type Tag = {
  name: Category;
  color: HTMLDivElement["className"];
};
export type ChartProps = {
  tags: Tag[];
  id: string;
  matches: MatchPopulated[];
};
export function ResultCharts(props: Props) {
  const charts: {
    id: string;
    tags: Tag[];
    component: React.ReactElement;
  }[] = [
    {
      id: "account-level-distribution",
      tags: [{ name: "Account level", color: "text-red-400 border-red-400" }],
      component: (
        <AccountLevelDistributionOfEnemies
          tags={[
            { name: "Account level", color: "text-red-400 border-red-400" },
          ]}
          id="account-level-distribution"
          matches={props.matches}
        />
      ),
    },
  ];
  return (
    <div className="flex flex-col h-full gap-4">
      <ToggleGroup type="multiple"></ToggleGroup>
      <div className="flex flex-row w-full gap-2">
        <AccountLevelDistributionOfEnemies
          tags={[
            { name: "Account level", color: "text-red-400 border-red-400" },
          ]}
          id="account-level-distribution"
          matches={props.matches}
        />
      </div>
    </div>
  );
}
