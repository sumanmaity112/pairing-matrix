import { mount } from "@vue/test-utils";
import { pairingMatrix } from "../data/testData";
import { TabularPairingChart } from "../../src/index";

describe("TabularPairingChart", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("should render tabular pairing chart", async () => {
    const wrapper = mount(TabularPairingChart, {
      props: {
        height: 700,
        width: 900,
        authors: pairingMatrix.authors,
        data: pairingMatrix.matrix,
      },
      attachTo: document.body,
    });

    expect(wrapper.html()).toMatchSnapshot();
  });

  it("should refresh tabular pairing chart on data update", async () => {
    const initialData = pairingMatrix.matrix;
    const newData = {
      author: "joe",
      coAuthor: "tonystark",
      times: 1,
    };
    const updatedData = [...initialData, newData];
    const authors = pairingMatrix.authors;

    const wrapper = mount(TabularPairingChart, {
      props: { height: 700, width: 900, authors: authors, data: initialData },
      attachTo: document.body,
    });

    expect(wrapper.html()).toMatchSnapshot();

    await wrapper.setProps({
      data: updatedData,
      authors: [...authors, newData.author],
    });

    expect(wrapper.html()).toMatchSnapshot();
  });
});
