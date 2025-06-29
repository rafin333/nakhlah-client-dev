import React from 'react';
import Image from 'next/image';
import Lottie from 'lottie-react';
import silverMedal from '../../assets/lottie/silverMedal.json';
import goldMedal from '../../assets/lottie/goldMedal.json';
import platinumMedal from '../../assets/lottie/platinumMedal.json';

function Header({ currentUserPosition = [] }) {
    const stock = currentUserPosition[0]?.stock || 0;

    return (
        <header style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0',
            margin: '0',
            height: 'auto',
            position: 'relative'
        }}>
            <Image
                src="/New Leaderboard Text.svg"
                width={350}
                height={200}
                alt="Leaderboard"
                style={{ marginTop: '-100px', marginBottom: '30px', display: 'block' }}
            />
            <Image
                src="/new banner.svg"
                width={450}
                height={250}
                alt="Medal"
                style={{ marginTop: '-50px', display: 'block' }}
            />
            <h1 style={{    display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '-186px', padding: '0' }}>
                <span>
                    {stock < 1500 ? (
                        <Lottie animationData={silverMedal} style={{ width: 150, height: 150 }} loop={false} />
                    ) : stock < 3000 ? (
                        <Lottie animationData={goldMedal} style={{ width: 150, height: 150 }} loop={false} />
                    ) : (
                        <Lottie animationData={platinumMedal} style={{ width: 150, height: 150 }} loop={false} />
                    )}
                </span>

                {/* <span className="points">{stock}</span> */}
            </h1>
        </header>
    );
}

export default Header;
