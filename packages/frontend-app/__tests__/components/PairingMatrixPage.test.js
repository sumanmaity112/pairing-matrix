import { shallowMount } from "@vue/test-utils";
import PairingMatrixPage from "@/components/PairingMatrixPage";
import PairingMatrix from "@/components/PairingMatrix";

describe("PairingMatrixPage", () => {
  const triggerRadioButtonClick = (radioInput) => {
    radioInput.trigger("click");
  };

  it("should render pairing matrix page with default configuration", () => {
    const wrapper = shallowMount(PairingMatrixPage);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it.each(["no"])(
    "should re-configure pullData configuration to %s",
    (suffix) => {
      const wrapper = shallowMount(PairingMatrixPage);

      triggerRadioButtonClick(
        wrapper.find(
          `[data-testid="pairing-matrix-pull-data-config-${suffix}"]`
        )
      );

      expect(wrapper.html()).toMatchSnapshot();
    }
  );
});
