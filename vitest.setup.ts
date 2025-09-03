import '@testing-library/jest-dom';
import { setProjectAnnotations } from '@storybook/react';
import * as globalStorybookConfig from './.storybook/preview';
import './src/test-utils/mockSetup';

// Storybookのグローバル設定をテスト環境に適用する
setProjectAnnotations(globalStorybookConfig);
