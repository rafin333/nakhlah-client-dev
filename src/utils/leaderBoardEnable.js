export default function leaderBoardEligibility(progressId,lessonData,examInfo) {
    // const query = {
    //     populate: "*",
    //     "sort[0]": "id:asc",
    //   };

  // const [leaderboardEnable, setLeaderboardEnable] = useState(false);

    let leaderboardEnable = false
      // const { data: learnerProgress } = useGetLearnerProgressQuery({ ...query });
      // const { data: lessonData, isLoading: lessonLoading } =
      //   useGetLearningJourneyLessonsQuery({ ...query });
      // const { data: examInfo } = useGetExamsQuery({ ...query });
    
      // const progressId = progressId;
      console.log(progressId);
      console.log(lessonData);
      console.log(examInfo);
      // Filter the array for objects with mysteryBox: false
      // const filteredArray = lessonData.filter(obj => obj.attributes.learning_journey_level.data.attributes.mysteryBox === false);
      // useEffect(() => {
        if (Array.isArray(lessonData)) {
          const filteredArray = lessonData.filter(
            (obj) =>
              obj?.attributes?.learning_journey_level?.data?.attributes?.mysteryBox ===
              false
          );
          // ... rest of your code ...
          console.log(filteredArray);
          // Extract the unique learning_journey_level IDs
          const uniqueIds = new Set(
            filteredArray.map(
              (obj) => obj?.attributes?.learning_journey_level?.data?.id
            )
          );
          console.log(uniqueIds);
          // Convert the Set to an array
          const result = Array.from(uniqueIds);
          console.log(result);
          // Find the index of the element with id proID
          const progressOfTaskId = lessonData.find((obj) => obj.id == progressId)
            ?.attributes?.learning_journey_level?.data?.id;
    
          // console.log(progressOfTaskId)
          // Find the index of the element with id 71
          // const index = result.indexOf(progressId);
    
          console.log(progressOfTaskId);
          const indexOfTask = result.indexOf(progressOfTaskId, 0);
          console.log(indexOfTask);
          // Check if the element exists
          if (indexOfTask !== -1) { 
            console.log(
              "The index of the element with id " +
                progressOfTaskId +
                " in the result array is:",
              indexOfTask
            ); 
            // At least two task needs to be complete 
            if (indexOfTask + 1 > 2) {
              console.log(indexOfTask); 
              let x;
              /// check at least first two exam of task is done or not. 
              for (let index = 0; index < 2; index++) {
                console.log(index);
                 x = examInfo?.find(
                  (ex) => ex.learning_journey_level.id == result[index]
                );
                console.log(x);
              }
     
              leaderboardEnable = x ? true : false;
            }
          } else {
            console.log(
              "The element with id " +
                progressOfTaskId +
                " does not exist in the result array."
            );
          }
    
          console.log(result);
        } else {
          console.error("lessonData is not defined or is not an array.");
        }
      // }, [lessonData]);

    return leaderboardEnable;
}