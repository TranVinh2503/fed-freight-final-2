import classNames from 'classnames/bind';
import styles from './Bubble.module.scss';

const cx = classNames.bind(styles);

function Bubble({ own, content }) {
    const classes = cx('bubble', own ? 'yourself' : 'other');
    return (
        <div className={cx('wrapper')}>
            <div className={classes}>{content}</div>
        </div>
    );
}

export default Bubble;
