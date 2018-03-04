import ChromePromise from 'chrome-promise';
import * as $ from 'jquery';
import * as echarts from 'echarts';

const chromep = new ChromePromise();

(async () => {
    const sitemon = await chromep.storage.sync.get();
    console.log(sitemon);

    const reportContainer = $('#report')[0] as HTMLDivElement;
    var chart = echarts.init(reportContainer);

    var option = {
        title: {
            text: 'Duration Graph Report',
            subtext: 'March 4, 2018',
            x: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{b}<br/>{c}'
        },
        legend: {
            x: 'center',
            y: 'bottom',
            data: [
                'rose1',
                'rose2',
                'rose3',
                'rose4',
                'rose5',
                'rose6',
                'rose7',
                'rose8'
            ]
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
                data: [
                    { value: 10, name: 'rose1' },
                    { value: 5, name: 'rose2' },
                    { value: 15, name: 'rose3' },
                    { value: 25, name: 'rose4' },
                    { value: 20, name: 'rose5' },
                    { value: 35, name: 'rose6' },
                    { value: 30, name: 'rose7' },
                    { value: 40, name: 'rose8' }
                ]
            }
        ]
    };

    chart.setOption(option);
})();
