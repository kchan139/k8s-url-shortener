import ReactApexChart from 'react-apexcharts';

export type ChartData = {
  title: string;
  dataValues: Array<number>;
  dataLabels: Array<string>;
  dataColors: Array<string>;
};

type BarChartProps = {
  chartData: ChartData;
};

export const BarChart = ({ chartData }: BarChartProps) => {
  const series = [
    {
      name: chartData.title,
      data: chartData.dataValues,
    },
  ];

  const options: ApexCharts.ApexOptions = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        dataLabels: {
          position: 'top', // top, center, bottom
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: string) => {
        return val;
      },
      offsetY: -20,
      style: {
        fontSize: '12px',
        colors: ['#3D4863'],
      },
    },

    colors: chartData.dataColors,
    grid: {
      borderColor: '#A3ACC2',
    },
    xaxis: {
      categories: chartData.dataLabels,
      position: 'bottom',
      labels: {
        formatter: (timestamp: string) => {
          return timestamp;
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      crosshairs: {
        fill: {
          type: 'gradient',
          gradient: {
            colorFrom: '#D8E3F0',
            colorTo: '#BED1E6',
            stops: [0, 100],
            opacityFrom: 0.4,
            opacityTo: 0.5,
          },
        },
      },
      tooltip: {
        enabled: true,
        offsetY: -35,
      },
    },
    // fill: {
    //   gradient: {
    //     shade: 'light',
    //     type: 'horizontal',
    //     shadeIntensity: 0.25,
    //     gradientToColors: undefined,
    //     inverseColors: true,
    //     opacityFrom: 1,
    //     opacityTo: 1,
    //     stops: [50, 0, 100, 100],
    //   },
    // },
    yaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: true,
        formatter: (val: number) => {
          return `${val}`;
        },
      },
    },
    // responsive: [
    //   {
    //     breakpoint: 496,
    //     options: {
    //       chart: {
    //         width: 320,
    //       },
    //     },
    //   },
    //   {
    //     breakpoint: 640,
    //     options: {
    //       chart: {
    //         width: 400,
    //       },
    //     },
    //   },
    //   {
    //     breakpoint: 768,
    //     options: {
    //       chart: {
    //         width: 520,
    //       },
    //     },
    //   },
    //   {
    //     breakpoint: 1280,
    //     options: {
    //       chart: {
    //         width: 720,
    //       },
    //     },
    //   },
    //   {
    //     breakpoint: 1536,
    //     options: {
    //       chart: {
    //         width: 960,
    //       },
    //     },
    //   },
    //   {
    //     breakpoint: 1920,
    //     options: {
    //       chart: {
    //         width: 1080,
    //       },
    //     },
    //   },
    // ],
    // title: {
    //   text: chartData.title,
    //   floating: true,
    //   offsetY: 330,
    //   align: 'center',
    //   style: {
    //     color: '#444',
    //   },
    // },
  };
  return (
    <ReactApexChart
      options={options}
      series={series}
      type="bar"
      width="100%"
      height="100%"
      // className="apex-charts"
    />
  );
};
