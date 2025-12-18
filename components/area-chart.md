# Area Chart Component Documentation

A reusable React component for rendering area charts using Recharts.

## Installation

The component is already set up in your project. Import it from:

```tsx
import { ChartArea } from '@/components/area-chart';
```

## Basic Usage

```tsx
import { ChartArea } from '@/components/area-chart';
import type { ChartConfig } from '@/components/ui/chart';

const data = [
  { month: "January", sales: 186 },
  { month: "February", sales: 305 },
  { month: "March", sales: 237 },
];

const config = {
  sales: {
    label: "Sales",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

<ChartArea
  data={data}
  config={config}
  dataKey="sales"
/>
```

## Required Props

| Prop | Type | Description |
|------|------|-------------|
| `data` | `Record<string, string \| number>[]` | Array of data objects. Each object represents a data point. |
| `config` | `ChartConfig` | Configuration object defining the chart series (label, color, etc.) |
| `dataKey` | `string` | The key in your data objects that contains the values to plot |

## Optional Props

### Data Configuration

- **`xAxisKey`** (`string?`): Key for x-axis labels. If not provided, uses the first key from your data object.

### Styling

- **`margin`** (`object?`): Chart margins. Default: `{ left: 12, right: 12 }`
  ```tsx
  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
  ```

- **`fillOpacity`** (`number?`): Opacity of the filled area (0-1). Default: `0.4`

- **`areaType`** (`string?`): Curve type for the area. Options:
  - `"natural"` (default)
  - `"monotone"`
  - `"linear"`
  - `"step"`
  - `"basis"`, `"basisClosed"`, `"basisOpen"`
  - `"linearClosed"`
  - `"stepBefore"`, `"stepAfter"`

### Chart Options

- **`showGrid`** (`boolean?`): Show/hide grid lines. Default: `true`

- **`gridVertical`** (`boolean?`): Show vertical grid lines. Default: `false`

- **`showTooltip`** (`boolean?`): Show/hide tooltip on hover. Default: `true`

- **`tooltipCursor`** (`boolean | cursor?`): Tooltip cursor behavior. Default: `false`

- **`tooltipIndicator`** (`"line" | "dot" | "dashed"?`): Tooltip indicator style. Default: `"line"`

### X-Axis Customization

- **`tickLine`** (`boolean?`): Show tick lines. Default: `false`

- **`axisLine`** (`boolean?`): Show axis line. Default: `false`

- **`tickMargin`** (`number?`): Margin between ticks and labels. Default: `8`

- **`tickFormatter`** (`function?`): Custom formatter for tick labels
  ```tsx
  tickFormatter={(value) => `${value}°C`}
  ```

## Examples

### Basic Chart

```tsx
<ChartArea
  data={[
    { quarter: "Q1", revenue: 45000 },
    { quarter: "Q2", revenue: 52000 },
  ]}
  config={{
    revenue: { label: "Revenue", color: "var(--chart-1)" }
  }}
  dataKey="revenue"
/>
```

### Custom Styling

```tsx
<ChartArea
  data={data}
  config={config}
  dataKey="sales"
  fillOpacity={0.6}
  areaType="monotone"
  margin={{ left: 20, right: 20, top: 10, bottom: 10 }}
/>
```

### Custom Tick Formatter

```tsx
<ChartArea
  data={temperatureData}
  config={tempConfig}
  dataKey="temp"
  tickFormatter={(value) => `${value}°C`}
/>
```

### Minimal Chart (No Tooltip, No Grid)

```tsx
<ChartArea
  data={data}
  config={config}
  dataKey="value"
  showTooltip={false}
  showGrid={false}
/>
```

## Data Format

Your data array should contain objects with at least:
- One key for the x-axis (labels)
- One key matching your `dataKey` (values)

Example:
```tsx
const data = [
  { month: "Jan", sales: 100, profit: 50 },
  { month: "Feb", sales: 150, profit: 75 },
];
```

## Config Format

The `config` object maps your data keys to chart configuration:

```tsx
const config = {
  sales: {
    label: "Sales",           // Display name in tooltip
    color: "var(--chart-1)",  // Color for the area
  },
  profit: {
    label: "Profit",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;
```

## Notes

- The component automatically detects the x-axis key if `xAxisKey` is not provided
- Colors can use CSS variables (e.g., `var(--chart-1)`) or HSL values
- All props are optional except `data`, `config`, and `dataKey`
- Additional props are passed through to the underlying `AreaChart` component

