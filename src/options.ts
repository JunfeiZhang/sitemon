import ChromePromise from 'chrome-promise';
import { formatDuration } from 'utils';
import * as $ from 'jquery';
import * as echarts from 'echarts';
import * as moment from 'moment';

const chromep = new ChromePromise();

interface SeriesItem {
    name: string;
    value: number;
}

interface ChartUpdateOption {
    subtext: string;
    legendItems: string[];
    seriesItems: SeriesItem[];
}

(async () => {
    const sitemon = await chromep.storage.sync.get();
    createSidebar(sitemon);
    handleClickSidebar(sitemon);
    const date = moment().format('LL');
    createGraphReport(sitemon, date);
})();

function createSidebar(sitemon: any): void {
    const $dates = $('#dates');
    const dates = Object.keys(sitemon);
    dates.forEach(date => {
        const li = $('<li/>')
            .text(date)
            .appendTo($dates);
        if (moment().format('LL') === date) li.addClass('active');
    });
}

function handleClickSidebar(sitemon: any): void {
    const $dates = $('#dates');
    $dates.on('click', 'li', function() {
        $('#dates li')
            .not(this)
            .removeClass('active');
        $(this).addClass('active');
        const clickedDate = $(this).text();
        createGraphReport(sitemon, clickedDate);
    });
}

function createGraphReport(sitemon: any, date: string): void {
    const list = sitemon[date] || [];
    const legendItems: string[] = [];
    const seriesItems: SeriesItem[] = [];

    Object.keys(list).forEach(hostname => {
        const duration = list[hostname];
        legendItems.push(hostname);
        seriesItems.push({
            name: hostname,
            value: duration
        });
    });

    const chartUpdateOption: ChartUpdateOption = {
        subtext: date,
        legendItems: legendItems,
        seriesItems: seriesItems
    };
    const option = createChartOption(chartUpdateOption);
    createChart(option);
}

function createChartOption(
    chartUpdateOption: ChartUpdateOption
): echarts.EChartOption {
    const option: echarts.EChartOption = {
        title: {
            text: 'Total Time Spent on Different Websites',
            subtext: chartUpdateOption.subtext,
            left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: (params: any) => {
                const hostname = params.data.name;
                const totalTime = params.data.value;
                return `${hostname}<br>${formatDuration(totalTime)}`;
            }
        },
        legend: {
            x: 'center',
            y: 'bottom',
            data: chartUpdateOption.legendItems
        },
        series: [
            {
                name: 'Website',
                type: 'pie',
                radius: [20, 200],
                center: ['50%', '50%'],
                roseType: 'radius',
                label: {
                    normal: {
                        show: false
                    },
                    emphasis: {
                        show: true
                    }
                },
                lableLine: {
                    normal: {
                        show: false
                    },
                    emphasis: {
                        show: true
                    }
                },
                data: chartUpdateOption.seriesItems
            }
        ]
    };
    return option;
}

function createChart(option: echarts.EChartOption): void {
    const reportContainer = $('#report')[0] as HTMLDivElement;
    var chart = echarts.init(reportContainer);
    chart.setOption(option);
}
