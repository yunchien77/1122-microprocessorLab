CROSS_COMPILE=aarch64-linux-gnu-
CXX=$(CROSS_COMPILE)g++
LD=$(CROSS_COMPILE)ld
CXXFLAGS=-std=c++11

OBJ=ellipse.o sort.o triangle.o main.o circular_sector.o 
SRC=ellipse.cpp sort.cpp triangle.cpp main.cpp circular_sector.cpp 
EXE=tx2_exe
all:$(EXE)
$(EXE):$(OBJ)
	$(CXX) -o $@ $^
$(OBJ):$(SRC)
	$(CXX) $(CXXFLAGS) -c $^
clean:
	rm -f $(EXE)
	rm -f $(OBJ)

