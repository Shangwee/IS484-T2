import MultiProgress from "react-multi-progress";

function CustomComponent({ children, element, ...rest }) {
    return (
        <div
        {...rest} 
        style={{
          fontWeight: element.isBold ? 900 : 300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",

        }}
      >
   <div>{element.label}</div>
        <div>{element.value}%</div>
      </div>
    );
  }
  
  function ProgressBar() {
    return (
      <div style={{ width: "30%", margin: "0 auto" }}> 
      <MultiProgress
        transitionTime={1.2}
        elements={[
          {
            value: 50,
            color: "red",
            showPercentage: true,
            textColor: "white",
            fontSize: 20,
            isBold: false,
            label: "Bearish",
          },
          {
            value: 30,
            color: "green",
            showPercentage: true,
            textColor: "white",
            fontSize: 20,
            isBold: false,
            className: "my-custom-css-class",
            label: "Bullish",
          },
          {
            value: 20,
            color: "grey",
            showPercentage: true,
            textColor: "white",
            fontSize: 20,
            isBold: false,
            className: "my-custom-css-class",
            label: "Neutral",
          },
        ]}
        height={45}
        backgroundColor="gray"
        border="3px solid black"
        component={CustomComponent}
      />
    </div>
    );
  }
  
export default ProgressBar;