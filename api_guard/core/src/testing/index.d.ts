export declare const DT_DEFAULT_UI_TEST_CONFIG: DtUiTestConfiguration;

export declare const DT_UI_TEST_CONFIG: InjectionToken<DtUiTestConfiguration>;

export declare function dtSetUiTestAttribute(
  overlay: Element,
  overlayId: string | null,
  componentElement?: ElementRef | Element,
  config?: DtUiTestConfiguration,
): void;

export interface DtUiTestConfiguration {
  attributeName: string;
  constructOverlayAttributeValue(uiTestId: string, id: number): string;
}
