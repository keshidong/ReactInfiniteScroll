import React, { Component } from 'react';
import ChatItem from './ChatItem';
import fakeFetch from './fakeFetch';
import InfiniteScroll from '../src/InfiniteScroll';

class App extends Component {
    state = {
        list: [],
        hasMore: true,
    }

    handleLoadMore = () => {
        this.fethList();
    }

    fethList = () => {
        fakeFetch(30)
            .then((data) => {
                const { hasMore, list } = data;
                this.setState({
                    list: this.state.list.concat(list),
                    hasMore,
                });
            });
    }

    componentDidMount() {
        this.fethList();
    }

    render() {
        return (
            <InfiniteScroll
                style={{
                    height: '100vh',
                    overflowX: 'auto',
                }}
                onLoadMore={this.handleLoadMore}
                maxItemCount={this.state.list.length}
            >
                {
                    (start, end) => {
                        console.log(start, end);
                        console.log(this.state.list);
                        console.log(this.state.list.slice(start, end));
                        return (
                            this.state.list.slice(start, end).map(item => (
                                <ChatItem
                                    key={item.id}
                                    {...item}>

                                </ChatItem>
                            ))
                        )
                    }

                }
            </InfiniteScroll>
        )
    }
}

export default App
