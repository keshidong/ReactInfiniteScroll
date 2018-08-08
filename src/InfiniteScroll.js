import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import './style.less';

class InfiniteScroll extends Component {
    // scrollGap = 400
    lastScrollTop = 0

    lastRuntimeScrollTop = 0

    scrollDeta = 100
    // visibleItemTotal = 20
    // untilLeftoverItemTotal = 5

    scrollGap = this.props.initScrollGap // 触发

    scrollDownGap = this.props.initScrollGap // 触发
    scrollUpGap = this.props.initScrollGap // 触发

    state = {
        start: 0,
        maxStartLimit: this.props.maxStartLimit,
    }

    static getDerivedStateFromProps(props, state) {
        if (props.maxStartLimit > state.maxStartLimit) {
            return {
                start: state.start + 1,
                maxStartLimit: props.maxStartLimit,
            }
        }
        return null;
    }

    handleScroll = () => {
        const curScrollTop = this.scrollContainer.scrollTop;
        const el = this.scrollContainer;

        // 往下滚动
        // if (this.ifInfinite && curScrollTop - this.lastScrollTop > this.scrollGap) {
        if (curScrollTop - this.lastScrollTop > this.scrollDownGap
            || (el.scrollHeight - curScrollTop) < (el.clientHeight + this.scrollDownGap)) {
            // 滚动到底部，且list不够的时

            console.log(this.state);
            if (this.state.maxStartLimit <= this.state.start) {
                // if (curScrollTop > this.lastScrollTop
                // && (el.scrollHeight - curScrollTop) < (el.clientHeight + this.scrollDeta)) {
                this.props.onHitScrollBottom();
                return;
            }

            // 计算即将要删除的第一个item的高度
            const startItemClientHeight = this.scrollContainer.children[0].clientHeight;

            // 更新 start = start + 1

            // lock infinite
            // this.ifInfinite = false;

            this.setState({
                // 在render函数内del第一个item, add后一个item
                start: this.state.start + 1,
            }, () => {
                const nextScrollTop = curScrollTop - startItemClientHeight;

                // 更新lastScrollTop值
                this.scrollContainer.scrollTop = nextScrollTop;
                this.lastScrollTop = nextScrollTop;

                // 更新srcollGap
                this.scrollDownGap = this.scrollContainer.lastElementChild.clientHeight;

                // unlock infinite
                // this.ifInfinite = true;
            });
        }

        // 往上滚动
        if ((this.lastScrollTop - curScrollTop > this.scrollUpGap) || curScrollTop < this.scrollUpGap) {
            // 如果已经start为0
            if (this.state.start <= 0) {
                return;
            }

            // 更新 start

            // lock infinite
            // this.ifInfinite = false;

            this.setState({
                start: this.state.start - 1,
            }, () => {
                // 计算已经加入的第一个item的高度
                const startItemClientHeight = this.scrollContainer.children[0].clientHeight;

                const nextScrollTop = curScrollTop + startItemClientHeight;

                // 更新lastScrollTop值
                this.scrollContainer.scrollTop = nextScrollTop;
                this.lastScrollTop = nextScrollTop;

                // 更新srcollGap
                this.scrollUpGap = startItemClientHeight;
                // unlock infinite
                // this.ifInfinite = true;
            });

        }
    }
    render() {
        const clsPrefix = 'c-InfiniteScrollContainer';
        const cls = cx(clsPrefix, {
            [this.props.className]: true,
        });
        return (
            <div
                className={cls}
                style={{
                    position: 'relative',
                    ...this.props.style,
                }}
            >
                <div
                    className={`${clsPrefix}--scroller`}
                    style={{
                        position: 'absolute',
                        height: '100%',
                        width: '100%',
                        overflowY: 'auto',
                    }}
                    ref={(dom) => { this.scrollContainer = dom; }}
                    onScroll={this.handleScroll}
                >
                    {
                        this.props.children(this.state.start)
                    }
                </div>
            </div>
        );
    }
}

InfiniteScroll.propTypes = {
    className: PropTypes.string,
    style: PropTypes.shape({}),
    initScrollGap: PropTypes.number,
    onHitScrollBottom: PropTypes.func,
    maxStartLimit: PropTypes.number,
};

InfiniteScroll.defaultProps = {
    className: '',
    style: {},
    initScrollGap: 240,
    onHitScrollBottom: () => {},
    maxStartLimit: 0,
};

export default InfiniteScroll;
