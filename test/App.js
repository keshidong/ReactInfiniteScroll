import React, { Component } from 'react';
import InfiniteScroll from '../src/InfiniteScroll';
import ChatItem from './ChatItem';
import fakeFetch from './fakeFetch';

class App extends Component {
    state = {
        list: [],
        hasMore: true,
    }

    handleLoadMore = () => {
        this.setState({
            list: this.state.concat([])
        })
    }

    componentDidMount() {
        fakeFetch(30)
            .then((data) => {
                const { hasMore, list } = data;
                this.setState({
                    list,
                    hasMore,
                });
            });
    }

    render() {
        return (
            <div
            >
                {
                    this.state.list.map(item => (
                        <ChatItem
                            key={item.id}
                            {...item}>

                        </ChatItem>
                    ))
                }
            </div>
        )
    }
}

export default App
