import { shallowMount } from "@vue/test-utils";
import Spinner from "../../src/components/Spinner";

describe("Spinner", () => {
  it("should render spinner", () => {
    const wrapper = shallowMount(Spinner);
    expect(wrapper.html()).toMatchInlineSnapshot('<div id="spinner"></div>');
  });
});
