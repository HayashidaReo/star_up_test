import type { Meta, StoryObj } from '@storybook/react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';

const meta: Meta<typeof Select> = {
  title: 'Atoms/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="blueberry">Blueberry</SelectItem>
        <SelectItem value="grapes">Grapes</SelectItem>
        <SelectItem value="pineapple">Pineapple</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const WithDisabledItem: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option1">Option 1</SelectItem>
        <SelectItem value="option2" disabled>
          Option 2 (disabled)
        </SelectItem>
        <SelectItem value="option3">Option 3</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const Wide: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[300px]">
        <SelectValue placeholder="Select a very long option name" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="short">Short</SelectItem>
        <SelectItem value="medium-length">Medium Length Option</SelectItem>
        <SelectItem value="very-long">
          This is a very long option that might overflow
        </SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const ManyOptions: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Choose a country" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="jp">🇯🇵 Japan</SelectItem>
        <SelectItem value="us">🇺🇸 United States</SelectItem>
        <SelectItem value="uk">🇬🇧 United Kingdom</SelectItem>
        <SelectItem value="ca">🇨🇦 Canada</SelectItem>
        <SelectItem value="au">🇦🇺 Australia</SelectItem>
        <SelectItem value="de">🇩🇪 Germany</SelectItem>
        <SelectItem value="fr">🇫🇷 France</SelectItem>
        <SelectItem value="it">🇮🇹 Italy</SelectItem>
        <SelectItem value="es">🇪🇸 Spain</SelectItem>
        <SelectItem value="br">🇧🇷 Brazil</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <label htmlFor="framework" className="text-sm font-medium">
        Framework
      </label>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select framework" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="next">Next.js</SelectItem>
          <SelectItem value="react">React</SelectItem>
          <SelectItem value="vue">Vue</SelectItem>
          <SelectItem value="angular">Angular</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};
