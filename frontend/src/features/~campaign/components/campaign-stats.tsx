import { BarChart, ChartData } from '@/components/charts/bar-chart';
import Click from '@/components/icons/click';
import Url from '@/components/icons/url';
import Section from '@/components/ui/section-wrapper';

type CampaignStatsProps = {
  chartData: ChartData;
  totalClickCount: number;
  totalShortenedLinks: number;
};

const CampaignStats = ({
  chartData,
  totalClickCount,
  totalShortenedLinks,
}: CampaignStatsProps) => {
  return (
    <Section className="flex flex-col items-center gap-5">
      <div className="w-full text-[24px] font-bold text-white">
        Campaign Statistics
      </div>
      <div className="relative flex w-full flex-col gap-5 lg:flex-row">
        <div className="relative flex h-80 w-full flex-col justify-between bg-white p-2 shadow-md sm:p-4 lg:w-[71.43%] lg:p-5 xl:h-[22.5rem] 2xl:h-[25rem]">
          <div className="text-[24px] font-bold">Graph</div>
          <div className="relative h-[90%] w-full sm:h-[85%]">
            <BarChart chartData={chartData} />
          </div>
        </div>
        <div className="relative flex h-80 w-full flex-col gap-5 lg:w-[28.57%] xl:h-[22.5rem] 2xl:h-[25rem]">
          <div className="relative flex size-full flex-row items-center justify-between bg-white px-5 shadow-md sm:px-10 md:px-20 lg:px-2 xl:px-5">
            <Url classname="size-16 lg:size-12 xl:size-16 relative" />
            <div className="relative text-[20px] font-medium">
              Shortened links
            </div>
            <div className="relative text-[24px] font-bold">
              {totalShortenedLinks}
            </div>
          </div>
          <div className="relative flex size-full flex-row items-center justify-between bg-white px-5 shadow-md sm:px-10 md:px-20 lg:px-2 xl:px-5">
            <Click classname="size-16 lg:size-12 xl:size-16 relative" />
            <div className="relative text-[20px] font-medium">Click counts</div>
            <div className="relative text-[24px] font-bold">
              {totalClickCount}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default CampaignStats;
