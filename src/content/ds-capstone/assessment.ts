import type { AssessmentDef } from "../types";

/**
 * Final assessment for the Data Scientist Capstone. Scenario questions across the whole
 * project: framing, leakage, point-in-time features, validation, calibration, trials,
 * thresholds, fairness and monitoring.
 */
export const DSC_ASSESSMENT: AssessmentDef = {
  id: "data-scientist-capstone-final",
  courseId: "data-scientist-capstone",
  title: "Data Scientist Capstone: final assessment",
  passingScore: 60,
  questions: [
    {
      id: "dscq01",
      prompt: "A manager asks for \"a model to stop bad orders\". What should you define first?",
      options: ["The algorithm", "The decision the model supports, the target and when the prediction is made", "The number of features", "The cloud platform"],
      answer: 1,
      explanation: "Frame the decision before building the model.",
    },
    {
      id: "dscq02",
      prompt: "Which feature is a leak for predicting failed delivery at checkout?",
      options: ["Basket value", "Number of delivery attempts", "Promised delivery days", "Device"],
      answer: 1,
      explanation: "Delivery attempts are only known after the delivery.",
    },
    {
      id: "dscq03",
      prompt: "A customer's earlier order is still out for delivery when they place a new one. Should its eventual failure count in the new order's prior failures?",
      options: ["Yes", "No: it wasn't known at checkout", "Only if it failed", "Only for prepaid orders"],
      answer: 1,
      explanation: "Point in time means known at the moment of prediction.",
    },
    {
      id: "dscq04",
      prompt: "A lifetime-failures column raises AUC from 0.59 to 0.84. What's the right conclusion?",
      options: ["Use it", "It leaks future outcomes and must not be used", "The model was underfitting", "AUC is unreliable"],
      answer: 1,
      explanation: "A big jump from a total calculated at export time is a leak.",
    },
    {
      id: "dscq05",
      prompt: "Why validate on later months rather than a random sample?",
      options: ["It's faster", "The model will predict the future, so test it on data after its training period", "It gives more data", "Random splits are illegal"],
      answer: 1,
      explanation: "Test the way it will be used.",
    },
    {
      id: "dscq06",
      prompt: "Half the test period's orders received a confirmation call. Which orders should test the model?",
      options: ["All of them", "Only the randomly chosen No-call orders", "Only the Call orders", "None"],
      answer: 1,
      explanation: "Calls changed the outcomes of the Call group.",
    },
    {
      id: "dscq07",
      prompt: "Orders the model scores at 30% risk fail about 30% of the time. What property is that?",
      options: ["High AUC", "Calibration", "Recall", "Low variance"],
      answer: 1,
      explanation: "Predicted matches actual.",
    },
    {
      id: "dscq08",
      prompt: "A call costs ₦250 and a failure ₦6,500. In a risk band, calls prevent 3 failures per 100. Should you call that band?",
      options: ["Yes", "No: 0.03 × ₦6,500 = ₦195, less than ₦250", "Only on weekends", "It depends on AUC"],
      answer: 1,
      explanation: "Value per call must exceed its cost.",
    },
    {
      id: "dscq09",
      prompt: "Why can you compare Call and No call within risk bands from the model?",
      options: ["The bands are equal in size", "The score uses only pre-call information, and calls were random within each band", "The model is calibrated", "You can't"],
      answer: 1,
      explanation: "Splitting by a pre-treatment variable keeps randomisation intact.",
    },
    {
      id: "dscq10",
      prompt: "The model badly under-predicts a city it never saw in training. Why?",
      options: ["The city's data is wrong", "Unseen categories get no learned effect", "AUC is low", "The trial"],
      answer: 1,
      explanation: "New markets need new data.",
    },
    {
      id: "dscq11",
      prompt: "Dropping the city feature leaves AUC unchanged. What should you do?",
      options: ["Keep it", "Drop it, and keep checking outcomes by city", "Add more location features", "Retrain daily"],
      answer: 1,
      explanation: "Same performance, less reliance on where people live.",
    },
    {
      id: "dscq12",
      prompt: "Overall calibration and PSI look fine, but one new market is badly mispredicted. What does that teach about monitoring?",
      options: ["Monitoring is pointless", "Check by segment and track new markets separately, not just overall numbers", "Use only PSI", "Ignore small markets"],
      answer: 1,
      explanation: "Averages hide segments.",
    },
  ],
};
