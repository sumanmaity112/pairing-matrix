import { mount } from "@vue/test-utils";
import { ChordPairingChart } from "../../src/index";
import { pairingMatrix } from "../data/testData";

describe("ChordPairingChart", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("should render chord pairing chart", async () => {
    const wrapper = mount(ChordPairingChart, {
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

  it("should refresh chord pairing chart on data update", async () => {
    const initialData = pairingMatrix.matrix;
    const newData = {
      author: "joe",
      coAuthor: "tonystark",
      times: 1,
    };
    const updatedData = [...initialData, newData];
    const authors = pairingMatrix.authors;
    const wrapper = mount(ChordPairingChart, {
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
