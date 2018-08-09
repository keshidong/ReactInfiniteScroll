import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './style.css';

class ChatItem extends Component {
    render() {
        const { id, avatar, self, image, time, message } = this.props;

        return (
            <li
                className={`chat-item ${self ? 'from-me' : ''}`}
                data-id={id}
            >
                <img className="avatar" width="48" height="48" src={avatar} />
                    <div className="bubble">
                        <p>{message}</p>
                        {
                            image
                                ? (
                                    <img
                                        width="300"
                                        height="300"
                                        src={image}
                                    />
                                )
                                : null
                        }
                            <div className="meta">
                                <time className="posted-date">{new Date(time).toString()}</time>
                            </div>
                    </div>
            </li>
        );
    }
}

ChatItem.propTypes = {
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    avatar: PropTypes.string,
    self: PropTypes.bool,
    image: PropTypes.string,
    time: PropTypes.number,
    message: PropTypes.string,
};
ChatItem.defaultProps = {
    avatar: '',
    self: false,
    image: '',
    time: 0,
    message: '',
};

export default ChatItem;
