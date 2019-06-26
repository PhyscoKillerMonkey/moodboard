import React from "react";
import PropTypes from "prop-types";
import Gallery from "react-photo-gallery";
import Carousel, { Modal as Lightbox, ModalGateway } from "react-images";
import Modal from "react-modal";

import EditForm from "./EditForm";
import { Close, Edit, FullscreenEnter, FullscreenExit } from "./icon";
import "./Board.css";

Modal.setAppElement("#root");

export default class Board extends React.Component {
  state = {
    currentIndex: 0,
    editIsOpen: false,
    lightboxIsOpen: false
  };

  openLightbox = (event, obj) => {
    this.setState({
      currentIndex: obj.index,
      lightboxIsOpen: true
    });
  };

  closeLightbox = () => {
    this.setState({
      currentIndex: 0,
      lightboxIsOpen: false
    });
  };

  gotoImage = index => {
    this.setState({
      currentIndex: index
    });
  };

  openEdit = () => {
    this.setState({ editIsOpen: true });
  };

  closeEdit = () => {
    this.setState({ editIsOpen: false });
  };

  updateImage = (id, changes) => {
    const { onUpdate } = this.props;
    onUpdate(id, changes)
      .then(() => this.closeEdit())
      .catch(err => console.error(err));
  };

  render() {
    const { images } = this.props;
    const { currentIndex, editIsOpen, lightboxIsOpen } = this.state;

    if (images.length === 0) {
      return null;
    }

    const galleryImages = [];
    const lightboxImages = [];
    images.forEach(el => {
      galleryImages.push({
        src: el.imageUrl,
        width: el.width,
        height: el.height,
        alt: el.description,
        key: el._id
      });
      lightboxImages.push({
        src: el.imageUrl,
        caption: el.description,
        alt: el.description,
        hostname: new URL(el.sourceUrl).hostname,
        sourceUrl: el.sourceUrl
      });
    });

    return (
      <div>
        <Gallery photos={galleryImages} onClick={this.openLightbox} />
        <ModalGateway>
          {lightboxIsOpen ? (
            <Lightbox onClose={this.closeLightbox}>
              <Carousel
                components={{
                  FooterCaption: ({ currentView }) => {
                    const { caption, hostname, sourceUrl } = currentView;
                    return (
                      <span className="imageCaption">
                        <span>{caption}</span>
                        <a href={sourceUrl}>{hostname}</a>
                      </span>
                    );
                  },
                  Header: ({ modalProps }) => {
                    const { isFullscreen, onClose, toggleFullscreen } = modalProps;

                    return (
                      <div className="header">
                        <span />
                        <span>
                          <button className="headerButton" onClick={this.openEdit} type="button">
                            <Edit />
                          </button>
                          <button className="headerButton" onClick={toggleFullscreen} type="button">
                            {isFullscreen ? <FullscreenExit /> : <FullscreenEnter />}
                          </button>
                          <button className="headerButton" onClick={onClose} type="button">
                            <Close />
                          </button>
                        </span>
                      </div>
                    );
                  }
                }}
                currentIndex={currentIndex}
                hideControlsWhenIdle={false}
                styles={{
                  footer: base => ({ ...base, alignItems: "flex-end" })
                }}
                trackProps={{
                  onViewChange: this.gotoImage
                }}
                views={lightboxImages}
              />
            </Lightbox>
          ) : null}
        </ModalGateway>
        <Modal
          isOpen={editIsOpen}
          onRequestClose={this.closeEdit}
          style={{
            overlay: {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 10
            },
            content: {
              position: "initial",
              width: "100%",
              maxWidth: "500px"
            }
          }}
        >
          <EditForm
            image={images[currentIndex]}
            onCancel={() => this.setState({ editIsOpen: false })}
            onUpdate={this.updateImage}
            onDelete={() => console.log("Delete image")}
          />
        </Modal>
      </div>
    );
  }
}

Board.propTypes = {
  images: PropTypes.array.isRequired,
  onUpdate: PropTypes.func.isRequired
};
