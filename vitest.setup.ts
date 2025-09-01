import '@testing-library/jest-dom';
import { setProjectAnnotations } from '@storybook/react';
import * as globalStorybookConfig from './.storybook/preview';

// Storybookのグローバル設定をテスト環境に適用する
setProjectAnnotations(globalStorybookConfig);
