import { mount } from "@vue/test-utils";
import PairingMatrixChart from "../../src/components/PairingMatrixChart";
import { pairingMatrix } from "../data/testData";

describe("PairingMatrixChart", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it.each(["chord", "tabular"])(
    "should render %s pairing chart",
    (chartType) => {
      const wrapper = mount(PairingMatrixChart, {
        props: {
          height: 700,
          width: 900,
          authors: pairingMatrix.authors,
          pairingMatrix: pairingMatrix.matrix,
          chart: chartType,
        },
        attachTo: document.body,
      });

      expect(wrapper.html()).toMatchSnapshot();
    }
  );
});
