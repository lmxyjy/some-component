// 基于react-spring实现的容器组件，可以平滑方式展开或者收起容器，
import { FC, ReactElement, ReactNode } from 'react';
import { useTransition, animated } from '@react-spring/web';

interface IProps {
    children: ReactNode;
    // 是否展开
    isShow: boolean;
    // 收缩的高度
    height: number;
}

const TransitionDiv: FC<IProps> = ({ children, isShow, height }): ReactElement => {
    const transition = useTransition(isShow, {
        initial: { opacity: 1, height: `${height}px` },
        from: { opacity: 0, height: '0px' },
        enter: { opacity: 1, height: `${height}px` },
        leave: { opacity: 0, height: '0px' },
    });

    return transition(
        (style, item) =>
            item && (
                <animated.div style={style}>
                    <div>{children}</div>
                </animated.div>
            ),
    );
};

export default TransitionDiv;
