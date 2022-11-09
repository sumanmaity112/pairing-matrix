import { shallowMount } from "@vue/test-utils";
import Alert from "../../src/components/Alert";

describe("Alert", () => {
  it.each([
    ["error", "alert message"],
    ["Error", "alert message"],
    ["Error", "Alert Message"],
    ["ERROR", "Alert Message"],
  ])('should render "%s" alert with message "%s"', (type, message) => {
    const wrapper = shallowMount(Alert, { props: { type, message } });
    expect(wrapper.classes("alert")).toBeTruthy();
    expect(wrapper.classes("danger")).toBeTruthy();
    expect(wrapper.find(`div`).wrapperElement.innerHTML).toBe(
      `<strong>${type}!</strong> ${message}`
    );
  });

  it.each([
    ["alert message", "Info"],
    ["alert message", "info"],
    ["Alert Message", "info"],
    ["Alert Message", "INFO"],
    ["Alert Message", "default"],
    ["Alert Message", ""],
  ])(
    'should render info alert with message "%s" when type is "%s"',
    (message, type) => {
      const wrapper = shallowMount(Alert, { props: { type, message } });
      expect(wrapper.classes("alert")).toBeTruthy();
      expect(wrapper.classes("info")).toBeTruthy();
      expect(wrapper.find(`div`).wrapperElement.innerHTML).toBe(
        `<strong>${type}!</strong> ${message}`
      );
    }
  );

  it("should render info alert when type is not present", () => {
    const message = "alert message";
    const wrapper = shallowMount(Alert, { props: { message } });
    expect(wrapper.classes("alert")).toBeTruthy();
    expect(wrapper.classes("info")).toBeTruthy();
    expect(wrapper.find(`div`).wrapperElement.innerHTML).toBe(
      `<strong>Info!</strong> ${message}`
    );
  });
});
