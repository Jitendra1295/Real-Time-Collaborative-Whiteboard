"use client";

import React, { useRef, useState, useLayoutEffect, useEffect } from 'react';
import { Stage, Layer, Line, Text } from 'react-konva';
import { useUser } from '../../context/UserContext';
import { roomDataChange, saveFeedback } from "../../utils/action"
import { useRouter } from 'next/navigation'
import { toast, ToastContainer } from "react-toastify";


const Whiteboard = () => {
    const [color, setColor] = useState('#000000');
    const [history, setHistory] = useState([]);
    const [tool, setTool] = useState('pen');
    const [feedback, setFeedback] = useState("");
    const [strokeWidth, setStrokeWidth] = useState(5);
    const [lines, setLines] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [text, setText] = useState("");
    const isDrawing = useRef(false);
    const stageRef = useRef(null);
    const [img, setImg] = useState(null)
    const { user, socket } = useUser();
    const router = useRouter();
    console.log("user::-->", user);

    useEffect(() => {
        console.log("Socket status:", socket);
        if (socket) {
            socket.on("whiteBoardData", (data) => {
                console.log("whiteBoardData::", data);
                setImg(data?.imageUrl);
            });
            socket.on("joinUsers", (data) => {
                toast.dark("User join!");
            });
        }

    }, [socket]);

    useLayoutEffect(() => {
        console.log("useLayoutEffect");
        if (stageRef.current) {
            console.log("useLayoutEffect 2");
            const canvasImage = stageRef.current.toDataURL();
            socket.emit("drawing", canvasImage);
        }
    }, [lines]);

    console.log("lines::", lines);
    const clearCanvas = () => {
        setLines([]);
    };
    const handleSaveFeedback = async () => {
        const added = await saveFeedback(user?._id, feedback)
        console.log("addedadded", added);
        return toast.dark(" Feedback added!");
    }
    const logOut = async () => {
        const data = {
            status: "inactive"
        }
        await roomDataChange(data, user?.roomId)
        router.push('/');
    };
    const handleSessionData = async () => {
        const data = {
            text: text,
            content: lines
        }
        await roomDataChange(data, user?.roomId)
    }
    const undo = () => {
        setHistory(prevHistory => [...prevHistory, lines[lines.length - 1]]);
        setLines(prevElements => prevElements.slice(0, -1));

    };
    const redo = () => {
        setLines(prevElements => [...prevElements, history[history.length - 1]]);
        setHistory(prevHistory => prevHistory.slice(0, -1));
    };

    const handleMouseDown = (e) => {
        isDrawing.current = true;
        const pos = e.target.getStage().getPointerPosition();
        setLines([...lines, { tool, strokeWidth: strokeWidth, color: color, points: [pos.x, pos.y] }]);
    };

    const handleMouseMove = (e) => {
        if (!isDrawing.current) {
            return;
        }
        const stage = e.target.getStage();
        const point = stage.getPointerPosition();
        let lastLine = lines[lines.length - 1];
        lastLine.points = lastLine.points.concat([point.x, point.y]);

        lines.splice(lines.length - 1, 1, lastLine);
        setLines(lines.concat());
    };

    const handleMouseUp = () => {
        isDrawing.current = false;
    };

    if (!user?.presenter) {
        return (
            <div className="container-fluid" style={{
                display: 'flex', flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop: "60px"
            }}>
                <ToastContainer />
                <div className="row">
                    <h1 className="display-5 pt-4 pb-3 text-center" >
                        Watcher: {user?.userName}
                    </h1>
                </div>
                <div style={{ width: "70%", height: "80vh", backgroundColor: "#ffffff" }}>
                    <img src={img} style={{ height: window.innerHeight, width: "100%" }} alt="real time whiteboard image" />
                </div>
                <div style={{ width: "40%", marginTop: "20px", }}>
                    <form>
                        <div data-mdb-input-init className="form-outline mb-4">
                            <label className="form-label" htmlFor="form2Example17"> Add Feedback</label>
                            <textarea
                                className="form-control"
                                rows="4"
                                value={feedback}
                                onChange={(e) => { setFeedback(e.target.value) }}
                            />
                            <input
                                type="button"
                                className="btn btn-primary mt-3"
                                value={"Save"}
                                onClick={() => { handleSaveFeedback() }}
                            />
                        </div>
                    </form>
                </div>
            </div >
        )
    }

    return (
        <div className="container-fluid" style={{ backgroundColor: "#ffffff", color: "#000000" }}    >
            <ToastContainer />
            <div className="row">
                <h1 className="display-5 pt-4 pb-3 text-center">
                    Presenter: {user.name}
                </h1>
            </div>
            <div className="col-md-40">
                <div className="color-picker d-flex align-items-center justify-content-center">
                    <input
                        type="button"
                        className="btn btn-danger"
                        value="Log out"
                        onClick={() => { logOut() }}
                    />
                </div>
            </div>
            {user?.presenter &&
                <div className="row justify-content-center align-items-center text-center py-2" >
                    <div className="col-md-2">
                        <div className="color-picker d-flex align-items-center justify-content-center">
                            Color Picker : &nbsp;
                            <input
                                type="color"
                                value={color}
                                onChange={e => setColor(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="form-group">
                            <label htmlFor="strokeWidthRange">Stroke Width: {strokeWidth}</label>
                            <input
                                type="range"
                                className="form-control-range"
                                id="strokeWidthRange"
                                min={0}
                                max={100}
                                value={strokeWidth}
                                onChange={e => setStrokeWidth(parseInt(e.target.value))}
                            />
                        </div>
                    </div>


                    <div className="col-md-2">
                        <button
                            type="button"
                            className="btn btn-outline-primary"
                            disabled={lines.length === 0}
                            onClick={() => { undo() }}
                        >
                            Undo
                        </button>
                        &nbsp;&nbsp;
                        <button
                            type="button"
                            className="btn btn-outline-primary ml-1"
                            disabled={history.length < 1}
                            onClick={() => { redo() }}
                        >
                            Redo
                        </button>
                    </div>
                    {showModal &&
                        <div className="modal-backdrop">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Add Text</h5>
                                </div>
                                <div className="modal-body">
                                    <textarea
                                        className="form-control"
                                        rows="4"
                                        value={text}
                                        onChange={(e) => { setText(e.target.value); }}
                                    />
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                                    <button type="button" className="btn btn-secondary" onClick={() => setText("")}>Clear</button>
                                </div>
                            </div>
                        </div>
                    }

                    <div className="col-md-1">
                        <div className="color-picker d-flex align-items-center justify-content-center">
                            <input
                                type="button"
                                className="btn btn-primary"
                                value={text ? "Edit Text" : "Add text"}
                                onClick={() => { setShowModal(true) }}
                            />
                        </div>
                    </div>
                    <div className="col-md-1">
                        <div className="color-picker d-flex align-items-center justify-content-center">
                            <input
                                type="button"
                                className="btn btn-primary"
                                value={"Save"}
                                onClick={() => { handleSessionData() }}
                            />
                        </div>
                    </div>
                    <div className="col-md-1">
                        <div className="color-picker d-flex align-items-center justify-content-center">
                            <input
                                type="button"
                                className="btn btn-danger"
                                value="Clear Canvas"
                                onClick={clearCanvas}
                            />
                        </div>
                    </div>
                </div>
            }

            <div className="row" style={{ marginTop: "2%", display: "flex", alignItems: "center", flexDirection: "column", justifyContent: "center" }} >
                {(typeof window !== 'undefined') &&
                    <div style={{ border: "5px solid #0000FF", borderRadius: '5px', overflow: 'hidden', display: "flex", alignItems: "center", justifyContent: "center", width: "70%", height: '75vh' }}>
                        <Stage
                            ref={stageRef}
                            width={window.innerWidth}
                            height={window.innerHeight}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                        >
                            <Layer>
                                <Text text={text} x={350} y={150} />
                                {lines.map((line, i) => (
                                    <Line
                                        key={i}
                                        points={line.points}
                                        stroke={line.color}
                                        strokeWidth={line.strokeWidth}
                                        tension={0.5}
                                        lineCap="round"
                                        lineJoin="round"
                                        globalCompositeOperation={
                                            line.tool === 'eraser' ? 'destination-out' : 'source-over'
                                        }
                                    />
                                ))}
                            </Layer>
                        </Stage>
                    </div>}
            </div>
        </div >
    );
};

export default Whiteboard;
