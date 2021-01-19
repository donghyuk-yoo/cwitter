import React, { useEffect, useState } from "react";
import { dbService } from 'fBase';


const Home = ({ userObj }) => {
    const [cweet, setCweet] = useState("");
    // getting Cweets
    const [cweets, setCweets] = useState([]);

    // 구식 방식
    // const getCweets = async() => {
    //     const dbCweets = await dbService.collection("cweets").get();
    //     dbCweets.forEach((document) => {
    //         const cweetObject = {
    //             ...document.data(),
    //             id: document.id
    //         }
    //         setCweets((prev) => [cweetObject, ...prev]);
    //     });
    // }

    useEffect(() => {
        // readm delete, update 등, 모든 동작시
        // 쿼리가 아닌 snapshot 사용으로 실시간 구현
        dbService.collection("cweets").onSnapshot(snapshot => {
            const cweetArray = snapshot.docs.map(doc => ({
                id:doc.id,
                ...doc.data()
            }));
            setCweets(cweetArray);
            console.log(cweetArray);
        })
    }, []);

    const onSubmit = async (event) => {
        event.preventDefault();
        await dbService.collection("cweets").add({
            text: cweet,
            createdAt: Date.now(),
            // 누가 cweet했는지
            creatorId: userObj.uid
        });
        setCweet('');
    };
    const onChange = (event) => {
        // 이벤트안의 target안의 벨류
        const {
            target: {value},
        } = event;
        setCweet(value);
    }
    
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input 
                    value={cweet} 
                    onChange={onChange}
                    type="text" 
                    placeholder="What's on your mind?" 
                    maxLength={120} 
                />
                <input type="submit" value="Cweet" />
            </form>
            <div>
                {cweets.map(cweet => 
                    <div key={cweet.id}>
                        {cweet.text}
                    </div>
                )}
            </div>
        </div>
    );

};
export default Home;