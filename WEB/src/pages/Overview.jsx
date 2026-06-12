import * as React from 'react';
import Stack from '@mui/material/Stack';
import { PieChart, PieChartProps } from '@mui/x-charts/PieChart';
import { HighlightItemIdentifier } from '@mui/x-charts/models';

export default function Overview() {
    const [highlightedItem, setHighlightedItem] =
        React.useState < HighlightItemIdentifier < 'pie' > | null > (null);

    return (
        <Stack>
            <PieChart
                {...pieChartProps}
                highlightedItem={highlightedItem as HighlightItemIdentifier<'pie'> | null}
                onHighlightChange={(item) =>
                    setHighlightedItem(
                        item ? { seriesId: item.seriesId, dataIndex: item.dataIndex } : null,
                    )
                }
            />
        </Stack>
    )
}

const pieChartProps: PieChartProps = {
    series: [
        {
            id: 'sync',
            data: [
                { value: 3, label: 'A', id: 'A' },
                { value: 4, label: 'B', id: 'B' },
                { value: 1, label: 'C', id: 'C' },
                { value: 6, label: 'D', id: 'D' },
                { value: 5, label: 'E', id: 'E' },
            ],
            highlightScope: { highlight: 'item', fade: 'global' },
        },
    ],
    height: 150,
    hideLegend: true,
};