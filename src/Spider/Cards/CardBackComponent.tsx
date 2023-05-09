

import { GCard } from '../Models/GCard';
// import cardBack from 'images/cardsImgs/spider_red.png'

interface CardBackComponent {
    card : GCard
}


const CardBackComponent = () => {
    return (
        <img
            src="images/cardsImgs/spider_red.png"
            width="100%"
            height="100%"
            draggable={false}

        />
    );
};

export default CardBackComponent;